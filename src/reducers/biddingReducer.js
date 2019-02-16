const CLOSE_BIDDING = 'CLOSE_BIDDING'
const START_BIDDING = 'START_BIDDING'
const SET_TIME_TO_CLOSE = 'SET_TIME_TO_CLOSE'

export default (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
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
  default:
    return state
  }
}


const initialState = {
}
