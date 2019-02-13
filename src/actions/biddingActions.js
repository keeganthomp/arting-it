const CLOSE_BIDDING = 'CLOSE_BIDDING'
const START_BIDDING = 'START_BIDDING'

export const closeBidding = ({ payload }) => dispatch => {
  dispatch({
    type: CLOSE_BIDDING,
    payload
  })
}

export const startBidding = ({ payload }) => dispatch => {
  dispatch({
    type: START_BIDDING,
    payload
  })
}
