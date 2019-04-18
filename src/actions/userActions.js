export const setUser = ({ payload }) => dispatch => {
  dispatch({
    type: 'GET_USER',
    payload
  })
}
