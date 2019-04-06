import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class BuyerPage extends Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render () {
    return(
      <h1>Buyer Page</h1>
    )
  }
}

BuyerPage.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user
  }
}

export default connect(mapStateToProps)(BuyerPage)
