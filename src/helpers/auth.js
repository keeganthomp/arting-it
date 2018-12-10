import { verifyUser } from '../api'

export const checkForValidUser = (callbackOnSuccess, callbackOnFailure) => {
  const isTokenExist = Boolean(sessionStorage.getItem('token'))
  console.log('IS TOKEN EXIST::', isTokenExist)
  const token = isTokenExist && JSON.parse(sessionStorage.getItem('token'))
  console.log('TOKEN::', token)
  verifyUser(token, callbackOnSuccess, callbackOnFailure)
}
