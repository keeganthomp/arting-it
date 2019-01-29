import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtInfo } from '../../api'
import * as R from 'ramda'
// import NumberFormat from 'react-number-format'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import PubNubReact from 'pubnub-react'

class BidPage extends Component {
  constructor(props) {
    super()
    this.state = {
      artId: props.match.params.id,
      artInfo: {},
      isFetchingArt: false
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.pubnub.init(this)
  }
  saveArtInfo = (artInfo) => {
    this.setState({ artInfo: artInfo.artPiece })
    this.setState({ isFetchingArt: false })
  }
  componentDidMount() {
    const { artId } = this.state
    this.setState({ isFetchingArt: true })
    getArtInfo(artId, this.saveArtInfo)
    // const messages = this.pubnub.getMessage('art')

    this.pubnub.subscribe({
      channels: ['art'],
      withPresence: false,
      restore: true
    })
    this.pubnub.getMessage('art', (msg) => {
      this.last_message = msg.message
    })
    
  }

  handleSubmit(event) {
    var startingBid = 30
    var data = this.state.biddingName
    console.log('THIS STAE::', this.state)
    var message = data +' : '+ this.state.bidAmount
    if(data != null) {
      if(this.state.bidAmount > startingBid && this.state.bidAmount < 1000000) {
        console.log('EOWOOWEORWEORWEOROWERO')
        this.pubnub.publish({
          message: message,
          channel: 'art'
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
    } else {
      alert('Enter username!')
    }
    event.preventDefault()
  }
  
  render () {
    const { isFetchingArt, artInfo, bidPrice } = this.state
    // const bidPriceClasses = classnames('bidding-page_bid-input', {
      'bidding-page_bid-input--default' : !bidPrice || bidPrice === artInfo.price
    })
    return !isFetchingArt && !R.isEmpty(artInfo) && (<div>
      <h1>Bidding Page</h1>
      <p>{artInfo.artist.username} is asking {artInfo.price}</p>
      <div className='bidding-page_art-content'>
        <img className='bidding-page_art-image' src={artInfo.artImage} />
        {/* <NumberFormat class={bidPriceClasses} value={this.state.bidPrice || artInfo.price} thousandSeparator={true} prefix={'$'} onValueChange={(values) => {
          const {formattedValue} = values
          this.setState({ bidPrice: formattedValue })
        }}/> */}
        <input onChange={(e) => this.setState({ biddingName: e.target.value })}type='text' />
        <input onChange={(e) => this.setState({ bidAmount: e.target.value })} type='number' />
        <Button onClick={(e) => this.handleSubmit(e)} variant='contained' color='primary'>Enter Bidding</Button>
      </div>
    </div>
    ) || <p>Getting Art shit...</p>
  }
}

BidPage.propTypes = {
  match: PropTypes.object,
  push: PropTypes.func,
  art: PropTypes.array,
  isFetchingArt: PropTypes.bool,
  selectedFilters: PropTypes.array
}

export default BidPage
