import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PubNubReact from 'pubnub-react'
import BidTimer from './BidTimer'

class BidStream extends Component {
  constructor() {
    super()
    this.state = {
      currentBids: [],
      fetchingBids: false,
      highestBid: ''
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    this.pubnub.init(this)
  }
  componentDidMount() {
    const { channelId } = this.props
    this.setState({ fetchingBids: true })
    this.pubnub.subscribe({
      channels: [channelId],
      withPresence: true,
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
    this.pubnub.addListener({
      presence: function(presenceEvent) {
        console.log('presence event came in: ', presenceEvent)
      }
    })
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
    this.getHighestBid({ currentBids: parsedBids })
  }
  getHighestBid = ({ currentBids }) => {
    const highestBid = currentBids.reduce((previousBid, currentBid) => {
      return (Number(currentBid.bid) > Number(previousBid.bid))
        ? currentBid
        : previousBid
    },{
      bid: '0'
    })
    this.setState({ highestBid })
  }
  saveNewBid = (newBid) => {
    this.setState({ currentBids: [...this.state.currentBids, newBid] })
    this.getHighestBid({ currentBids: this.state.currentBids })
  }
  render () {
    const { currentBids, fetchingBids, highestBid } = this.state
    const { user } = this.props
    return(!fetchingBids && <div>
      <BidTimer currentBids={currentBids} />
      {highestBid && <div>Highest Bidder is {highestBid.bidder} with a bid of {highestBid.bid}</div>}
      <h1>Bid Stream</h1>
      {currentBids.slice(Math.max(currentBids.length - 5, 0)).reverse().map((bid, i) => (<div className={bid.bidder === user.username ? 'bid-stream-bid--own-bid' : 'bid-stream-bid'} key={i}>
        <p>Bidder: {bid.bidder}</p>
        <p>Bid: {this.formatter.format(bid.bid)}</p>
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
