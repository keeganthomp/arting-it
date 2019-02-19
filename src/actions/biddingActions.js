const CLOSE_BIDDING = 'CLOSE_BIDDING'
const START_BIDDING = 'START_BIDDING'
const SET_TIME_TO_CLOSE = 'SET_TIME_TO_CLOSE'
const SET_HIGHEST_BIDDER = 'SET_HIGHEST_BIDDER'

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

export const setTimeToClose = ({ payload }) => dispatch => {
  dispatch({
    type: SET_TIME_TO_CLOSE,
    payload
  })
}

export const setHighestBidder = ({ payload }) => dispatch => {
  dispatch({
    type: SET_HIGHEST_BIDDER,
    payload
  })
}
