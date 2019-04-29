const SET_USER = 'SET_USER'

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_USER: {
    const { user } = action.payload
    const typeOfUser = user.artistId ? 'artist' : 'buyer'
    return {
      [typeOfUser]: {
        ...user
      }
    }
  }
  default:
    return state
  }
}

const initialState = {}
