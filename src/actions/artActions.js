const GET_ART = 'GET_ART'

export const getArtistArt = ({ payload }) => dispatch => {
  dispatch({
    type: GET_ART,
    payload
  })
}
