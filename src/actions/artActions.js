const GET_ART = 'GET_ART'
const ADD_ART = 'ADD_ART'

export const getArtistArt = ({ payload }) => dispatch => {
  dispatch({
    type: GET_ART,
    payload
  })
}

export const addArt = ({ payload }) => dispatch => {
  dispatch({
    type: ADD_ART,
    payload
  })
}
