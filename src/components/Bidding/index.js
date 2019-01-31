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


class BidPage extends Component {
  constructor(props) {
    super()
    this.state = {
      artId: props.match.params.id,
      artInfo: {},
      isFetchingArt: false,
      user: {},
      bidAmount: ''
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.pubnub.init(this)
    checkForValidUser({
      callbackOnSuccess: () => this.setUser(),
      callbackOnFailure: () => this.props.history.push('/login')
    })
  }
  setUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    this.setState({ user })
  }
  saveArtInfo = (artInfo) => {
    this.setState({ artInfo: artInfo.artPiece })
    this.setState({ isFetchingArt: false })
  }
  componentDidMount() {
    const { artId } = this.state
    this.setState({ isFetchingArt: true })
    getArtInfo(artId, this.saveArtInfo)
    this.pubnub.subscribe({
      channels: [artId],
      withPresence: false,
      restore: true
    })
  }

  handleSubmit(event) {
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
            console.log('message Published w/ timetoken', response.timetoken)
          }
        })
      } else {
        alert('Enter value between Starting Bid and 1000000!')
      }
    }
    event.preventDefault()
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }
  
  render () {
    const { isFetchingArt, artInfo, numberformat, artId, user } = this.state
    return !isFetchingArt && !R.isEmpty(artInfo) && (<div>
      <h1>Bidding Page</h1>
      <p>{artInfo.artist.username} is asking {artInfo.price}</p>
      <div className='bidding-page_art-content'>
        <FormControl>
          <img className='bidding-page_art-image' src={artInfo.artImage} />
          <TextField
            label='Bid Amount'
            value={numberformat}
            onChange={this.handleChange('bidAmount')}
            id='formatted-numberformat-input'
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
        </FormControl>
        <div className='bidding-page_submit-button-wrapper'>
          <Button onClick={(e) => this.handleSubmit(e)} variant='contained' color='primary' disabled={this.state.bidAmount === ''}>Place Bid</Button>
        </div>
      </div>
      <BidStream user={user} channelId={artId}/>
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
  history: PropTypes.object
}

export default BidPage
