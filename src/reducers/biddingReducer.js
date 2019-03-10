const CLOSE_BIDDING = 'CLOSE_BIDDING'
const START_BIDDING = 'START_BIDDING'
const SET_TIME_TO_CLOSE = 'SET_TIME_TO_CLOSE'
const SET_HIGHEST_BIDDER = 'SET_HIGHEST_BIDDER'

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
  case CLOSE_BIDDING:
    return Object.assign({}, state, {
      [payload]: {
        isBiddingClosed: true 
      }
    })
  case START_BIDDING:
    return Object.assign({}, state, {
      [payload.artId]: {
        ...state[payload.artId],
        isBiddingOpen: true,
        startTime: payload.startTime
      }
    })
  case SET_TIME_TO_CLOSE:
    return Object.assign({}, state, {
      [payload.artId]: {
        ...state[payload.artId],
        timeToClose: payload.timeToClose
      }
    })
  case SET_HIGHEST_BIDDER:
    return Object.assign({}, state, {
      [payload.artId]: {
        ...state[payload.artId],
        highestBidder: payload.highestBidder
      }
    })
  default:
    return state
  }
}


const initialState = {
}
