export const getUser = ({ payload }) => dispatch => {
  console.log('WEE PAYLOAD:D:', payload)
  dispatch({
    type: 'GET_USER',
    payload
  })
}
