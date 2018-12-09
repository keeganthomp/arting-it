import axios from 'axios'

export const makeTartApiRequest = ({ method, location, body = {}, callbackOnSuccess,  callbackOnFailure }) => {
  const token = JSON.parse(sessionStorage.getItem('token'))
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: `http://${process.env.NODE_ENV === 'production' ? '142.93.241.62' : 'localhost'}:8080${location}`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      data: body
    }).then(axiosResult => {
      if (callbackOnSuccess) callbackOnSuccess(axiosResult.data)
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

export const verifyUser = (token, callbackOnSuccess, callbackOnFailure) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/me/from/token',
    body: {
      token
    },
    callbackOnSuccess,
    callbackOnFailure
  })
}

export const getArtInfo = (id, callbackOnSuccess, callbackOnFailure) => {
  makeTartApiRequest({
    method: 'GET',
    location: `/api/art/${id}`,
    callbackOnSuccess,
    callbackOnFailure
  })
}

export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  window.location = 'http://localhost:5300/login'
  makeTartApiRequest({
    method: 'POST',
    location: '/api/logout'
  })
}
