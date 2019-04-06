import React, {Component} from 'react'
import {Elements, StripeProvider} from 'react-stripe-elements'
import CreditCardCapture from './CreditCardCapture'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setBuyer } from 'actions/buyerActions'

class Checkout extends Component {
  render() {
    const { artist, setBuyer } = this.props
    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
        <Elements>
          <CreditCardCapture userId={artist && artist.artistId} setBuyer={setBuyer} />
        </Elements>
      </StripeProvider>
    )
  }
}

Checkout.propTypes = {
  artist: PropTypes.object,
  setBuyer: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    artist: state.user.artist
  }
}

const mapDispatchToProps = {
  setBuyer
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
