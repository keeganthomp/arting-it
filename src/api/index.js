import axios from 'axios'

export const makeTartApiRequest = ({ method, location, body = {}, callbackOnSuccess,  callbackOnFailure }) => {
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: `http://localhost:8080${location}`,
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
  return makeTartApiRequest({
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

export const getArtist = (id) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/${id}`
  })
}

export const updateArtist = (body, id) => {
  makeTartApiRequest({
    method: 'PATCH',
    location: `/api/artist/${id}`,
    body
  })
}
  export const uploadThing = (body, id) => {
    return makeTartApiRequest({
      method: 'PATCH',
      location: `/api/artist/${id}`,
      body
    })
  }

export const updateArt = (body, id) => {
  makeTartApiRequest({
    method: 'PATCH',
    location: `/api/update/art/${id}`,
    body
  })
}
