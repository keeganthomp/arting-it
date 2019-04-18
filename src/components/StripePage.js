import React, { Component } from 'react'
import PropTypes from 'prop-types'
const queryString = require('query-string')
import { createStripeConnectAccount } from 'api'
import { connect } from 'react-redux'

class StripePage extends Component {
  componentDidMount () {
    const { search } = this.props.location
    const parsedQueryParams = queryString.parse(search)
    const stripeClientId = parsedQueryParams && parsedQueryParams.code
    const redirectPage = process.env.NODE_ENV === 'production' ? 'https://www.tealeel.com' : 'http://localhost:5300'
    if (!stripeClientId) {
      window.location = redirectPage
    } else {
      if (stripeClientId) {
        createStripeConnectAccount({
          clientId: stripeClientId,
          artistId: this.props.artist.artistId
        }).then((axiosResult) => {
          const artistWithStripId = axiosResult.data.artist
          window.location = redirectPage
        })
      }
    }
  }
  render () {
    const { search } = this.props.location
    const parsedQueryParams = queryString.parse(search)
    const stripeClientId = parsedQueryParams && parsedQueryParams.code
    return(stripeClientId ? <div>Saving Stripe stuff...</div> : null)
  }
}

StripePage.propTypes = {
  location: PropTypes.object,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user.artist
  }
}

export default connect(mapStateToProps)(StripePage)
