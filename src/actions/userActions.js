const SET_USER = 'SET_USER'

export const setUser = ({ payload }) => dispatch => {
  dispatch({
    type: SET_USER,
    payload
  })
}
