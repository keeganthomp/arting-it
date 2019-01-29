import React, { Component } from 'react'
import PubNubReact from 'pubnub-react'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      highest: 0,
      people: 0,
      currentBids: []
    }
    this.pubnub = new PubNubReact({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
    })
    this.pubnub.init(this)
  }
  componentDidMount() {
    this.pubnub.addListener({
      presence: function(presenceEvent) {
        console.log('presence event came in: ', presenceEvent)
      }
    })
    this.pubnub.subscribe({
      channels: ['art'],
      withPresence: true,
      restore: true
    })
    this.pubnub.history(
      {
        channel : 'art',
        count : 5
      }, (status, response) => this.getBidderAndbid(response.messages)
    )
    this.pubnub.getMessage('art', (msg) => {
      const bidder = msg.message.split(':')[0].replace(/\s/g, '')
      const bid = msg.message.split(':')[1].replace(/\s/g, '')
      const formmattedBid = {
        bidder,
        bid
      }
      this.saveNewBid(formmattedBid)
    })
    this.getBidderAndbid(this.state.currentBids)
    this.pubnub.hereNow(
      {
        channels: ['art'],
        includeState: true
      },
      function(status, response) {
        console.log('WOOPER:', response)
      }
    )
  }
  saveNewBid = (newBid) => {
    this.setState({ currentBids: [...this.state.currentBids, newBid] })
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
  render () {
    const { currentBids } = this.state
    return (
      <div>
        <h1>BIDDING DASHBOARDD</h1>
        <div>
          {currentBids.map((bid, index) => (<div key={index}>
            <p>Bidder: {bid.bidder}</p>
            <p>Bid: {bid.bid}</p>
          </div>))
          }
        </div>
      </div>
    )
  }
}