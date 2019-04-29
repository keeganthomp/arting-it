const SET_TOKEN = 'SET_TOKEN'

export const setToken = ({ payload }) => dispatch => {
  dispatch({
    type: SET_TOKEN,
    payload
  })
}