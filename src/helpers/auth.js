import { verifyUser } from '../api'

export const checkForValidUser = (callbackOnSuccess, callbackOnFailure) => {
  const token = JSON.parse(sessionStorage.getItem('token'))
  verifyUser(token, callbackOnSuccess, callbackOnFailure)
}
