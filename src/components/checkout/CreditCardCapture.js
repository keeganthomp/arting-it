import React, {Component} from 'react'
import {CardElement, injectStripe} from 'react-stripe-elements'
// import {Elements, StripeProvider} from 'react-stripe-elements'
import { createStripeBuyer } from 'api'

class CreditCardCatpure extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  async submit(e) {
    e.preventDefault()
    const { userId, stripe, setBuyer } = this.props
    const { token } = await stripe.createToken({ name: 'Bouji Boi' })
    await createStripeBuyer({
      token: token.id,
      userId
    }).then(async result => {
      const buyerId = result.data.buyer.id
      await setBuyer({
        payload: {
          token: buyerId
        }
      })
    })
  }

  render() {
    return (
      <div className='credit-card-form'>
        <p>Insert your credit card information to start bidding.</p>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    )
  }
}

export default injectStripe(CreditCardCatpure)