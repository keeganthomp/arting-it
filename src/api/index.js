import axios from 'axios'

export const makeTartApiRequest = ({ method, token, location, body = {} }) => {
  return new Promise((resolve, reject) => {
    return axios({
      method: method,
      url: location,
      headers: { 'Content-Type': 'application/json' },
      data: body
    }).then(axiosResult => {
      resolve(axiosResult)
    }).catch(err => {
      console.log('ERROR:', err)
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

export const login = (body) => {
  makeTartApiRequest({
    method: 'POST',
    location: '/api/artist/login',
    body
  })
}