import axios from 'axios'

export const makeTartApiRequest = ({ method, token, location, body = {}, callbackOnSuccess,  callbackOnFailure}) => {
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: location,
      headers: { 'Content-Type': 'application/json' },
      data: body
    }).then(axiosResult => {
      if (callbackOnSuccess) callbackOnSuccess(axiosResult.data.artist)
      else resolve(axiosResult)
    }).catch(err => {
      callbackOnFailure && callbackOnFailure(err)
      reject(err)
    })
  })
}

export const createArtist = (body) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/artist/signup',
    body
  })
}

export const login = (body, callbackOnSuccess, callbackOnFailure) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/artist/login',
    body,
    callbackOnSuccess,
    callbackOnFailure
  })
}

export const getArtist = (body) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/artist',
    body
  })
}