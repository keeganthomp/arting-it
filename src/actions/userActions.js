export const saveUser = ({ payload }) => dispatch => {
  dispatch({
    type: 'GET_USER',
    payload
  })
}
