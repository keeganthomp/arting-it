const GET_ART = 'GET_ART'
const ADD_ART = 'ADD_ART'

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
  case GET_ART:
    return payload
  case ADD_ART:
    if (state.artPieces.some(artpiece => artpiece.artId === payload.artId)) {
      const updatedArtpieces = state.artPieces.reduce((acc, artpiece) => {
        if (artpiece.artId === payload.artId) {
          return acc.concat(payload)
        } else{
          return acc.concat(artpiece)
        }
      }, [])
      return Object.assign({}, state, {
        artPieces: [ ...updatedArtpieces ]
      })
    } else {
      return Object.assign({}, state, {
        artPieces: [ ...state.artPieces, payload ]
      })
    }
  default:
    return state
  }
}

const initialState = {
  artPieces: []
}