import React from 'react'

const StripeButton = () => {
  const stripeClientId = process.env.REACT_APP_STRIPE_CLIENT_ID_TEST
  const redirectUri = 'http://localhost:5300/'
  const connectedStripeAccountLink = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${redirectUri}&client_id=${stripeClientId}`
  return(<div className='stripe-button_container'>
    <p className='stripe-connect-button_description'>Click here to set up your bank account</p>
    <div 
      className='stripe-connect-button'
      onClick={() => window.location = connectedStripeAccountLink}>
      <i className='fab fa-cc-stripe' />
    </div>
  </div>)
}

export default StripeButton