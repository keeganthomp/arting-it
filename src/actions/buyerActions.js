const SET_BUYER = 'SET_BUYER'

export const setBuyer = ({ payload }) => dispatch => {
  console.log('SEINGG', payload)
  dispatch({
    type: SET_BUYER,
    payload
  })
}