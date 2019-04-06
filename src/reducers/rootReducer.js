import { combineReducers } from 'redux'
import userReducer from './user'
import artReducer from './artReducer'
import biddingReducer from './biddingReducer'
import buyerReducer from './buyerReducer'

export default combineReducers({
  user: userReducer,
  art: artReducer,
  bid: biddingReducer,
  buyer: buyerReducer
})
