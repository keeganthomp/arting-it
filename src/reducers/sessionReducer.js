const SET_TOKEN = 'SET_TOKEN'

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_TOKEN: {
    return action.payload
  }
  default:
    return state
  }
}

const initialState = {
  token: null
}
