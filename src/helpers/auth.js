import { verifyUser } from '../api'

export const checkForValidUser = (callbackOnSuccess, callbackOnFailure) => {
  const isTokenExist = Boolean(sessionStorage.getItem('token'))
  const token = isTokenExist && JSON.parse(sessionStorage.getItem('token'))
  verifyUser(token, callbackOnSuccess, callbackOnFailure)
}
