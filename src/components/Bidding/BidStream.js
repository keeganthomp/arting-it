import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PubNubReact from 'pubnub-react'

class BidStream extends Component {
  constructor() {
    super()
    this.state = {
      currentBids: [],
      fetchingBids: false
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.pubnub.init(this)
  }
  componentDidMount() {
    const { channelId } = this.props
    this.setState({ fetchingBids: true })
    this.pubnub.subscribe({
      channels: [channelId],
      withPresence: false,
      restore: true
    })
    this.pubnub.history(
      {
        channel : channelId,
        count : 5
      }, (status, response) => {
        this.getBidderAndbid(response.messages)
        this.setState({ fetchingBids: false })
      }
    )
    this.pubnub.getMessage(channelId, (msg) => {
      const bidder = msg.message.split(':')[0].replace(/\s/g, '')
      const bid = msg.message.split(':')[1].replace(/\s/g, '')
      const formmattedBid = {
        bidder,
        bid
      }
      this.saveNewBid(formmattedBid)
    })
    
  }
  getBidderAndbid = (message) => {
    const parsedBids = message.reduce((formattedBids, currentBid) => {
      const bidder = currentBid.entry.split(':')[0].replace(/\s/g, '')
      const bid = currentBid.entry.split(':')[1].replace(/\s/g, '')
      const formmattedBid = {
        bidder,
        bid
      }
      return formattedBids.concat(formmattedBid)
    }, [])
    this.setState({ currentBids: parsedBids })
  }
  saveNewBid = (newBid) => {
    this.setState({ currentBids: [...this.state.currentBids, newBid] })
  }
  render () {
    const { currentBids, fetchingBids } = this.state
    const { user } = this.props
    return(!fetchingBids && <div>
      <h1>Bid Stream</h1>
      {currentBids.slice(Math.max(currentBids.length - 5, 1)).reverse().map((bid, i) => (<div className={bid.bidder === user.username ? 'bid-stream-bid--own-bid' : 'bid-stream-bid'} key={i}>
        <p>Bidder: {bid.bidder}</p>
        <p>Bid: {bid.bid}</p>
      </div>))}
    </div> || <p>Fetching Bids...</p>)
  }
}

BidStream.propTypes = {
  match: PropTypes.object,
  push: PropTypes.func,
  art: PropTypes.array,
  isFetchingArt: PropTypes.bool,
  selectedFilters: PropTypes.array,
  channelId: PropTypes.string,
  user: PropTypes.object
}

export default BidStream
