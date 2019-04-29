import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PubNubReact from 'pubnub-react'
import BidTimer from './BidTimer'
import { updateArt, getArtist, scheduleTextMessage, createChargeAndTransfer, getArtistFromId, retrieveCustomerPaymentInfo } from 'api'
import { startBidding, setHighestBidder } from 'actions/biddingActions'
import { connect } from 'react-redux'
import moment from 'moment'

class BidStream extends Component {
  constructor() {
    super()
    this.state = {
      currentBids: [],
      fetchingBids: false,
      highestBid: '',
      artistStripeId: ''
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
    const { channelId, artInfo } = this.props
    getArtistFromId({ artistId: artInfo.artistId }).then(response => {
      const artist = response.data.artist
      this.setState({ artistStripeId: artist.stripeId })
    })
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
        const doesArtHaveBids = response.messages.length > 0
        if (doesArtHaveBids && !artInfo.bidStartTime) {
          this.updateArtBidInfo()
        }
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

  updateArtBidInfo = () => {
    const { artInfo } = this.props
    const artPieceWithBiddingStartTime = {
      ...artInfo,
      bidStartTime: moment().unix()
    }
    this.props.startBidding({ payload: {
      artId: artInfo.artId,
      startTime: moment().unix()
    } })
    this.setState({ startTime: moment().unix() })
    updateArt({
      body: { ...artPieceWithBiddingStartTime },
      id: artInfo.artId
    })
  }

  checkPaymentMethod = () => {
    const { buyerToken } = this.props
    retrieveCustomerPaymentInfo({
      customerId: buyerToken
    })
  }

  closeBid = () => {
    const { highestBid, artistStripeId } = this.state
    const { artInfo, buyerToken } = this.props
    const bidAmount = Number(highestBid.bid) * 100
    const artPieceWithBiddingEndTime = {
      ...artInfo,
      closeTime: moment().unix()
    }
    setTimeout(() => updateArt({
      body: { ...artPieceWithBiddingEndTime },
      artId: artInfo.artId
    }), 1000)
    createChargeAndTransfer({
      buyer: buyerToken,
      seller: artistStripeId,
      amount: bidAmount
    })
    const highestBidder = this.state.highestBidderProfile
    scheduleTextMessage({
      phoneNumber: highestBidder.phone,
      message: `WOOOO ${highestBidder.username}!! You freaking won the art auction. Please go to https://www.tealeel.com/ to finalize the purchase.`,
      time: artPieceWithBiddingEndTime.startTime
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
      bid: ''
    })
    if (this.state.highestBid !== highestBid) {
      this.setState({ highestBid })
      if (highestBid) {
        highestBid.bidder && getArtist(highestBid.bidder, (data) => {
          const highestBidder = data.artist
          this.setState({ highestBidderProfile: highestBidder })
          this.props.setHighestBidder({
            payload: {
              highestBidder,
              artId: this.props.artInfo.artId
            }
          })
        })
      }
    }
  }
  saveNewBid = (newBid) => {
    this.setState({ currentBids: [...this.state.currentBids, newBid] })
    this.getHighestBid({ currentBids: this.state.currentBids })
    !(this.props.artInfo && this.props.artInfo.biddingStartTime) && this.updateArtBidInfo({ isClosingBidding: false })
  }
  render () {
    const { currentBids, fetchingBids, highestBid, highestBidderProfile } = this.state
    const { user, artInfo } = this.props
    const doesHighestBidExist = highestBid.bid && highestBid.bid !== ''
    const timeToStart = this.state.startTime || artInfo.bidStartTime
    return(!fetchingBids && <div>
      <BidTimer
        currentBids={currentBids}
        startTime={timeToStart}
        isBiddingClosed={artInfo.closeTime}
        artId={artInfo.artId}
        closeBid={this.closeBid}
        artInfo={artInfo}
        highestBidderProfile={highestBidderProfile}
      />
      {doesHighestBidExist && <div>
        <p>{`${highestBid.bidder === user.username
          ? `You are the highest bidder with a bid of $${highestBid.bid}`
          : `Highest Bidder is ${highestBid.bidder} with a bid of $${highestBid.bid}`
        }`}</p>
      </div>}
      <h1>Bid Stream</h1>
      <button onClick={() => this.checkPaymentMethod()}>CHECK PAYMENT METHOD</button>
      {currentBids.slice(Math.max(currentBids.length - 5, 0)).reverse().map((bid, i) => (<div
        className={bid.bidder === user.username ? 'bid-stream-bid--own-bid' : 'bid-stream-bid'}
        key={i}>
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
  user: PropTypes.object,
  artInfo: PropTypes.object,
  currentArtistArt: PropTypes.array,
  startBidding: PropTypes.func,
  setHighestBidder: PropTypes.func,
  bidInfo: PropTypes.object,
  buyerToken: PropTypes.string
}

const mapStateToProps = (state, props) => {
  return {
    bidInfo: state.bid[props.artInfo.id],
    buyerToken: state.buyer.token,
    token: state.session.token
  }
}

const mapDispatchToProps = {
  startBidding,
  setHighestBidder
}

export default connect(mapStateToProps, mapDispatchToProps)(BidStream)
