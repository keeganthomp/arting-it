import { verifyUser } from '../api'

export const checkForValidUser = (callbackOnSuccess, callbackOnFailure) => {
  const isTokenExist = sessionStorage.getItem('token') !== 'undefined'
  console.log('TOKEN BABY:', sessionStorage.getItem('token'))
  const token = isTokenExist && JSON.parse(sessionStorage.getItem('token'))
  verifyUser(token, callbackOnSuccess, callbackOnFailure)
}
