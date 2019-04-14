import axios from 'axios'

const apiUrl = process.env.NODE_ENV === 'production' ? 'https://www.tealeel-api.com' : 'http://localhost:5000'

export const makeTartApiRequest = ({ method, location, body = {}, callbackOnSuccess,  callbackOnFailure }) => {
  const isUserFromSession = sessionStorage.getItem('token') !== 'undefined'
  const token = isUserFromSession && JSON.parse(sessionStorage.getItem('token'))
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: `${apiUrl}${location}`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      data: body
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

export const getArtist = (artistId, callbackOnSuccess) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/${artistId}`,
    callbackOnSuccess
  })
}

export const getArtistFromId = ({ artistId }) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/id/${artistId}`
  })
}

export const getArtistArt = ({ callbackOnSuccess, artistId }) => {
  return makeTartApiRequest({
    method: 'GET',
    location: `/api/artist/art/${artistId}`,
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

export const updateArt = ({ body, id }) => {
  return makeTartApiRequest({
    method: 'PATCH',
    location: `/api/update/art/${id}`,
    body
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

export const getAllArt = () => {
  return makeTartApiRequest({
    method: 'GET',
    location: '/api/art'
  })
}

export const createStripeConnectAccount = ({ clientId }) => {
  return makeTartApiRequest({
    method: 'POST',
    location: '/api/create/stripe/account',
    body: {
      clientId
    }
  })
}

export const createChargeAndTransfer = ({ seller, buyer }) => {
  return makeTartApiRequest({
    method: 'POST',
    location: '/api/create/charge',
    body: {
      seller,
      buyer
    }
  })
}

export const createStripeBuyer = ({ token, userId }) => {
  return makeTartApiRequest({
    method: 'POST',
    location: '/api/create/buyer',
    body: {
      token,
      userId
    }
  })
}

