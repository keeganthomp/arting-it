import React, { Component } from 'react'
import Countdown from 'react-countdown-now'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeBidding } from 'actions/biddingActions'

class BidTimer extends Component {
  constructor() {
    super()
    this.state = {
      start: false
    }
  }

  renderTimer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>BIDDING CLOSED</span>
    } else {
      // Render a countdown
      return (<div>
        <button onClick={() => this.handleClosingBid()}>Close bidding</button>
        <p>Time left to bid on this art piece: <span>{hours}:{minutes}:{seconds}</span></p>
      </div>
      )
    }
  }

  handleClosingBid = () => {
    const { closeBid, closeBidding, artId } = this.props
    closeBid()
    closeBidding({ payload: artId })
  }

  render() {
    const { startTime, bidInfo, isBiddingClosed } = this.props
    const shouldBiddingBeClosed = isBiddingClosed || (bidInfo && bidInfo.isBiddingClosed)
    const biddingStartTime = (bidInfo && bidInfo.startTime) || startTime
    const twentyFourHoursFromBiddingStartTime = biddingStartTime && new Date(biddingStartTime*1000).getTime() + (24 * 60 * 60 * 1000)
    return (biddingStartTime && !shouldBiddingBeClosed
      ? <div>
        <Countdown
          renderer={this.renderTimer}
          date={twentyFourHoursFromBiddingStartTime}
        />
      </div>
      : shouldBiddingBeClosed
        ? <p>BIDDING CLOSED</p>
        : null)
  }
}

BidTimer.propTypes = {
  startTime: PropTypes.number,
  updateArtBidInfo: PropTypes.func,
  closeBidding: PropTypes.func,
  artId: PropTypes.string,
  bidInfo: PropTypes.object,
  isBiddingClosed: PropTypes.number,
  closeBid: PropTypes.func
}

const mapStateToProps = (state, props) => {
  return {
    bidInfo: state.bid[props.artId]
  }
}

const mapDispatchToProps = {
  closeBidding
}

export default connect(mapStateToProps, mapDispatchToProps)(BidTimer)
