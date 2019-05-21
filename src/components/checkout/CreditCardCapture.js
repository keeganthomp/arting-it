import React, {Component} from 'react'
import {CardElement, injectStripe} from 'react-stripe-elements'
// import {Elements, StripeProvider} from 'react-stripe-elements'
import { createStripeBuyer } from 'api'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
        <TextField
          required
          label='Email'
          type='email'
          name='email'
          placeholder='example@gmail.com'
          style={{ marginBottom: '.5rem' }}
          value={this.state.email}
          onChange={this.handleEmailChange()}
          InputLabelProps={{
            shrink: true
          }}
        />
        <CardElement onChange={cardForm => console.log('isComplete', cardForm.complete)} />
        <Button
          onClick={this.submit} 
          type='submit'
          variant='contained'
          color='primary'
          style={{ marginTop: '.5rem' }}>
          Start Bidding
        </Button>
      </div>
    )
  }
}

export default injectStripe(CreditCardCatpure)