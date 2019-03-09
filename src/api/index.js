import axios from 'axios'

export const makeTartApiRequest = ({ method, location, body = {}, callbackOnSuccess,  callbackOnFailure }) => {
  const isUserFromSession = sessionStorage.getItem('token') !== 'undefined'
  const token = isUserFromSession && JSON.parse(sessionStorage.getItem('token'))
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: `http://${process.env.NODE_ENV === 'production' ? 'tealeel-api.com' : 'localhost'}${location}`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      data: body,
      onUploadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          console.log(progressEvent.loaded + ' ' + progressEvent.total)
        }
      }
    }).then(axiosResult => {
      if (callbackOnSuccess) {
        callbackOnSuccess(axiosResult.data)
      } else {
        resolve(axiosResult)
      }
    }).catch(err => {
      err && callbackOnFailure && callbackOnFailure(err)
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

export const getArtist = (username, callbackOnSuccess) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/${username}`,
    callbackOnSuccess
  })
}

export const getArtistArt = ({ username, callbackOnSuccess }) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/${username}/art`,
    callbackOnSuccess
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

export const updateArt = (body, id, callbackOnSuccess) => {
  makeTartApiRequest({
    method: 'PATCH',
    location: `/api/update/art/${id}`,
    body,
    callbackOnSuccess
  })
}

export const verifyUser = ({ token, callbackOnSuccess, callbackOnFailure }) => {
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
  window.location = `http://${process.env.NODE_ENV === 'production' ? 'tealeel.com' : 'localhost:5300'}/login`
  makeTartApiRequest({
    method: 'POST',
    location: '/api/logout'
  })
}

export const getPlaidAccessToken = (accessToken) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/get_access_token',
    body: {
      accessToken
    }
  })
}

export const scheduleTextMessage = ({ phoneNumber, message, time }) => {
  console.log('SENDING TEXT::')
  makeTartApiRequest({
    method: 'POST',
    location: '/api/schedule/message',
    body: {
      phoneNumber,
      message,
      time
    }
  })
}

export const getStripeToken = ({ accesToken, accountId }) => {
  return makeTartApiRequest({
    method: 'POST',
    location: '/api/get_stripe_token',
    body: {
      accesToken,
      accountId
    }
  })
}