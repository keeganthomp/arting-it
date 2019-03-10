const GET_ART = 'GET_ART'
const ADD_ART = 'ADD_ART'

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
  case GET_ART:
    return payload
  case ADD_ART:
    return Object.assign({}, state, {
      artPieces: [ ...state.artPieces, payload ]
    })
  default:
    return state
  }
}

const initialState = {
  artPieces: []
}