import { verifyUser } from '../api'

export const checkForValidUser = ({ callbackOnSuccess, callbackOnFailure }) => {
  const isTokenExist = sessionStorage.getItem('token') !== 'undefined'
  const token = isTokenExist && JSON.parse(sessionStorage.getItem('token'))
  verifyUser({ token, callbackOnSuccess, callbackOnFailure })
}
