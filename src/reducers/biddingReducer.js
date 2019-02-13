const CLOSE_BIDDING = 'CLOSE_BIDDING'
const START_BIDDING = 'START_BIDDING'

export default (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
  case CLOSE_BIDDING:
    return {
      [payload]: {
        isBiddingClosed: true 
      }
    }
  case START_BIDDING:
    return {
      [payload.artId]: {
        isBiddingOpen: true,
        startTime: payload.startTime
      }
    }
  default:
    return state
  }
}


const initialState = {

}
