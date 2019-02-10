import { combineReducers } from 'redux'
import userReducer from './user'
import artReducer from './artReducer'

export default combineReducers({
  user: userReducer,
  art: artReducer
})
