const plaid = require('plaid')
const stripe = require('stripe')('sk_test_Ja5Jzw6ngHs2DONskiy4xeWH')

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
  const plaidClient = new plaid.Client('5c1c34a0736cca0010f4e075', '583ef5ef5765a6f0ecf017092407b4', '86f51a3110f358a66fe814f05de929', plaid.environments.sandbox)
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
