import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtInfo } from '../../api'
import * as R from 'ramda'
// import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import PubNubReact from 'pubnub-react'
import BidStream from '../Bidding/BidStream'
import { checkForValidUser } from '../../helpers/auth'
import TextField from '@material-ui/core/TextField'
import NumberFormatCustom from '../ui/formattedNumberInput'
import FormControl from '@material-ui/core/FormControl'
import { getArtistArt } from 'api/index'
import { startBidding } from 'actions/biddingActions'
import { setBuyer } from 'actions/buyerActions'
import { connect } from 'react-redux'
import Checkout from 'components/checkout/Checkout'
import moment from 'moment'

class BidPage extends Component {
  constructor(props) {
    super()
    this.state = {
      artId: props.match.params.id,
      artInfo: {},
      isFetchingArt: false,
      user: {},
      bidAmount: '',
      currentArtistArt: [],
      biddingIsOpen: true
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.pubnub.init(this)
    checkForValidUser({
      callbackOnSuccess: () => this.setUser(),
      callbackOnFailure: () => this.props.history.push('/login'),
      token: props.artist.token
    })
  }

  closeBidding = () => {
    this.setState({ biddingIsOpen: false })
  }

  saveParsedArt = ({ art }) => {
    const parsedArt = art.map(artPiece => JSON.parse(artPiece))
    this.setState({ currentArtistArt: parsedArt })
  }

  setUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.setState({ user })
  }

  saveArtInfo = (art) => {
    const { artist, artInfo } = art.artPiece
    console.log('ARTINFO:', artInfo)
    this.setState({
      artInfo,
      artist
    })
    this.setState({ isFetchingArt: false })
    getArtistArt({
      username: artist.username,
      artistId: artist.artistId,
      callbackOnSuccess: data => {
        console.log('BIODDING DATA:', data)
        // this.saveParsedArt({ art: data.artistArt })
      }
    })
  }

  componentDidMount() {
    const { artId } = this.state
    this.setState({ isFetchingArt: true })
    getArtInfo(artId, this.saveArtInfo)
    this.pubnub.subscribe({
      channels: [artId],
      withPresence: true,
      restore: true
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { user, artId } = this.state
    // need to find highest bid and use that in place of startingBid placeholder
    const startingBid = 0
    const bidder = user.username
    const message = bidder +' : '+ this.state.bidAmount
    if(bidder !== null) {
      if(this.state.bidAmount > startingBid && this.state.bidAmount < 1000000) {
        this.pubnub.publish({
          message,
          channel: artId
        }, (status, response) => {
          if (status.error) {
            // handle error
            console.log(status)
          } else {
            console.log('message published:', response)
          }
        })
      } else {
        alert('Enter value between Starting Bid and 1000000!')
      }
    }
    this.props.startBidding({ payload: {
      artId,
      startTime: moment().unix()
    } })
    this.setState({ bidAmount: '' })
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }
  
  render () {
    const {
      isFetchingArt,
      artInfo,
      bidAmount,
      artId,
      artist,
      user
    } = this.state
    const doesBuyerExist = !!this.props.buyerToken
    return !isFetchingArt && !R.isEmpty(artInfo) && (<div>
      <h1>Bidding Page</h1>
      <p>{artist.username} is asking {artInfo.price}</p>
      <div className='bidding-page_art-content'>
        <form>
          <FormControl>
            <img className='bidding-page_art-image' src={artInfo.artImage} />
            {doesBuyerExist 
              ?  <TextField
                label='Bid Amount'
                value={bidAmount}
                onChange={this.handleChange('bidAmount')}
                id='formatted-numberformat-input'
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
              />
              : <Checkout />}
            {doesBuyerExist && <div className='bidding-page_submit-button-wrapper'>
              <Button type='submit'onClick={(e) => this.handleSubmit(e)} variant='contained' color='primary' disabled={this.state.bidAmount === ''}>Place Bid</Button>
            </div>}
          </FormControl>
        </form>
      </div>
      {doesBuyerExist && <BidStream
        artist={artist}
        artInfo={artInfo}
        user={user}
        channelId={artId}
      />}
    </div>
    ) || <p>Getting Art shit...</p>
  }
}

BidPage.propTypes = {
  match: PropTypes.object,
  push: PropTypes.func,
  art: PropTypes.array,
  isFetchingArt: PropTypes.bool,
  selectedFilters: PropTypes.array,
  history: PropTypes.object,
  startBidding: PropTypes.func,
  artist: PropTypes.object,
  buyer: PropTypes.object
}

const mapStateToProps = (state, props) => {
  const artId = props.match.params.id
  return {
    timeLeftToBid: state.bid[artId] && state.bid[artId].timeToClose,
    artist: state.user,
    buyerToken: state.buyer.token
  }
}

const mapDispatchToProps = {
  startBidding
}

export default connect(mapStateToProps, mapDispatchToProps)(BidPage)
