const SET_BUYER = 'SET_BUYER'

export const setBuyer = ({ payload }) => dispatch => {
  dispatch({
    type: SET_BUYER,
    payload
  })
}