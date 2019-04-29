import { combineReducers } from 'redux'
import userReducer from './user'
import artReducer from './artReducer'
import biddingReducer from './biddingReducer'
import buyerReducer from './buyerReducer'
import sessionReducer from './sessionReducer'

export default combineReducers({
  user: userReducer,
  art: artReducer,
  bid: biddingReducer,
  buyer: buyerReducer,
  session: sessionReducer
})
