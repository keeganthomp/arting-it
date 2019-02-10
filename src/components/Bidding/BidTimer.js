import React, { Component } from 'react'
import Countdown from 'react-countdown-now'
import PropTypes from 'prop-types'

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
      return <span>WOOOO</span>
    } else {
      // Render a countdown
      return (<div>
        There are <span>{hours}:{minutes}:{seconds}</span> left on this art piece.
      </div>
      )
    }
  };

  render() {
    const { currentBids } = this.props
    const doesBidExist = currentBids.length > 0
    return (doesBidExist && <div>
      <Countdown
        renderer={this.renderTimer}
        date={Date.now() + 10000}
      />
    </div>)
  }
}

BidTimer.propTypes = {
  currentBids: PropTypes.array
}

export default BidTimer
