import { verifyUser } from '../api'

export const checkForValidUser = ({ callbackOnSuccess, callbackOnFailure, token = null }) => {
  const isTokenInSessionEmpty = sessionStorage.getItem('token') !== 'undefined' || sessionStorage.getItem('token') !== null
  const isTokenExist = !isTokenInSessionEmpty || token !== null
  const tokenForServer = isTokenExist && (!isTokenInSessionEmpty
    ? JSON.parse(sessionStorage.getItem('token'))
    : token)
  verifyUser({ token: tokenForServer, callbackOnSuccess, callbackOnFailure })
}
