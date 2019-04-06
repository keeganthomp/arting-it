import React from 'react'

const StripeButton = () => {
  const connectedStripeAccountLink = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://localhost:5300/&client_id=ca_EffV60ZGfT5OB2IOBh9CvoWH7mgHrpDJ'
  return(<div className='stripe-button_container'>
    <button 
      className='stripe-button'
      onClick={() => window.location = connectedStripeAccountLink} >Connect Account</button>
  </div>)
}

export default StripeButton