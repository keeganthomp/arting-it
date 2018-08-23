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
  console.log('BODYY IN API FINC:', body)
  makeTartApiRequest({
    method: 'POST',
    location: '/api/artist',
    body
  })
}