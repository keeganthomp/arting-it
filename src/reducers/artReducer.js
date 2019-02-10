export default (state = {}, action) => {
  switch (action.type) {
  case 'GET_ART':
    return action.payload
  default:
    return state
  }
}