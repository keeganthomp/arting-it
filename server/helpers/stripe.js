const plaid = require('plaid')
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_KEY)

const createStripeCustomer = (tokenID, res) => {
  stripe.customers.create({
    source: tokenID,
    description: 'TOMMY JOHNNY'
  }, (err, customer) => {
    console.log('ERRRRRRRR""', err)
    console.log('CUSTOMERRRR:R', customer)
  })
}

const grabStripeToken = (req, res) => {
  const { accesToken, accountId } = req.body
  const plaidClient = new plaid.Client(
    process.env.REACT_APP_PLAID_CLIENT_ID,
    process.env.REACT_APP_PLAID_SECRET,
    process.env.REACT_APP_PLAID_PUBLIC_KEY,
    plaid.environments.sandbox)
  plaidClient.exchangePublicToken(accesToken, (exchangeError, exchangeRepsonse) => {
    console.log('ERR:', exchangeError)
    const accessToken = exchangeRepsonse.access_token
    // Generate a bank account token
    plaidClient.createStripeToken(accessToken, accountId, (stripeTokenError, stripeTokenRepsonse) => {
      console.log('WOOOOO"', stripeTokenRepsonse)
      const bankAccountToken = stripeTokenRepsonse.stripe_bank_account_token
      if (!stripeTokenError) {
        res.json({
          status: 200,
          message: 'Successfullly exchanged Plaid token for bank account token',
          bankAccountToken
        })
        createStripeCustomer(bankAccountToken)
      }
    })
  })
}

module.exports = {
  grabStripeToken
}
