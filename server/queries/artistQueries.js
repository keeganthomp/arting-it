const omit = require('lodash/omit')
const { generateHash, validPassword } = require('../helpers/validation')
const { generateToken } = require('../helpers/utils')

// importing db model
const { Artist } = require('../models/Artist')

const createArtist = (req, res) => {
  Object.keys(req.body).forEach(key => {
    !req.body[key] && delete req.body[key]
  })
  const payloadWithoutPassword = omit(req.body, ['password'])
  const payload = { 
    ...payloadWithoutPassword,
    password: generateHash(req.body.password),
    art: []
  }
  Artist.create(payload).then(newArtist => {
    if (newArtist) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created New Artist'
        })
    } else {
      res.status(400).json({
        error: 'Looks like you are missing some fields'
      })
    }
  })
}

const getAllArtists = (req, res) => {
  Artist.findAll().then((data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL artists'
      })
  })
}

const getArtistLogin = (req, res) => {
  const { username, password } = req.body
  Artist.findOne({
    where: {
      username
    }
  }).then(artist => {
    if (artist && validPassword(password, artist.dataValues.password)) {
      const artistData = omit(artist.dataValues, ['password']) 
      req.session.user = artistData
      const token = generateToken(artistData)
      res.json({
        status: 200,
        artist: artistData,
        token
      })
    } else {
      res.status(400).json({
        error: 'Incorrect username or password'
      })
    }
  })
}

const getArtist = (req, res) => {
  Artist.findOne({
    where: {
      username: req.params.username
    }
  }).then(artist => {
    if (artist) {
      res.json({
        status: 200,
        artist: omit(artist.dataValues, ['password'])
      })
    } else {
      res.status(400).json({
        error: 'No Artist Found'
      })
    }
  })
}

// const updateArtist = (req, res) => {
//   const bufffer = Buffer.from(req.body.avatar, 'base64')
//   const  tempDirectory = './temp'
//   if (!fs.existsSync(tempDirectory)){
//     fs.mkdirSync(tempDirectory)
//   }
//   fs.writeFile('./temp/test.jpeg', bufffer, (err) => {
//     if(err) {
//       console.log('err', err)
//     }
//   })
//   Artist.update(
//     { avatar: 'bufffer' },
//     { where: { id: req.params.id } }
//   ).then(updatedArtist => {
//     if (updatedArtist) {
//       res.json({
//         status: 200,
//         woo: 'UPDATEDDD',
//         updatedArtist
//       })
//     } else {
//       res.status(400).json({
//         error: 'UNABLE TO UPDATE ARTIST'
//       })
//     }
//   })
// }

const getArtistArt = (req, res) => {
  Artist.findOne({
    where: {
      username: req.params.username
    }
  }).then(artist => {
    if (artist) {
      res.json({
        status: 200,
        artistArt: omit(artist.dataValues, ['password']).art
      })
    } else {
      res.status(400).json({
        error: 'No Artist Found'
      })
    }
  })
}

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin,
  getArtist,
  // updateArtist,
  getArtistArt
}
