import React from 'react'

const StripeButton = () => {
  const stripeClientId = process.env.REACT_APP_STRIPE_CLIENT_ID_TEST
  const redirectUri = 'http://localhost:5300/'
  const connectedStripeAccountLink = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${redirectUri}&client_id=${stripeClientId}`
  return(<div className='stripe-button_container'>
    <button 
      className='stripe-button'
      onClick={() => window.location = connectedStripeAccountLink} >Connect Account</button>
  </div>)
}

export default StripeButton