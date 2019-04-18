import React, {Component} from 'react'
import {CardElement, injectStripe} from 'react-stripe-elements'
// import {Elements, StripeProvider} from 'react-stripe-elements'
import { createStripeBuyer } from 'api'

class CreditCardCatpure extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
    this.submit = this.submit.bind(this)
  }

  async submit(e) {
    e.preventDefault()
    const { userId, stripe, setBuyer } = this.props
    const { email } = this.state
    const { token } = await stripe.createToken({ name: 'Bouji Boi' })
    await createStripeBuyer({
      token: token.id,
      email,
      userId
    }).then(async result => {
      const buyer = result.data.buyer
      console.log('BUYERR')
      await setBuyer({
        payload: {
          token: buyer.stripeToken
        }
      })
    })
  }
  handleEmailChange = () => (e) => {
    const email = e.target.value
    this.setState({ email })
  }

  render() {
    return (
      <div className='credit-card-form'>
        <p>Insert your credit card information and email to start bidding.</p>
        <input
          type='email'
          placeholder='example@gmail.com'
          onChange={this.handleEmailChange()}
          value={this.state.email}/>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    )
  }
}

export default injectStripe(CreditCardCatpure)