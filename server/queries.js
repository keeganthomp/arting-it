const omit = require('lodash/omit')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/tart')
const { generateHash, validPassword } = require('./helpers/validation')

const Artist = sequelize.define('artist', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5,17],
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  specialty: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  },
  avatar: {
    type: Sequelize.STRING
  }
})

Artist.sync().then(() => 'Artists Table Ready')

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

const createArtist = (req, res) => {
  Object.keys(req.body).forEach(key => {
    !req.body[key] && delete req.body[key]
  })
  const payloadWithoutPassword = omit(req.body, ['password'])
  const payload = { ...payloadWithoutPassword, password: generateHash(req.body.password)}
  Artist.create(payload).then(newArtist => {
    res.status(200)
      .json({
        status: 'success',
        new_user: newArtist,
        message: 'Created New Artist'
    })
  }).catch(e => console.log('SIGNUP EEE:', e.errors))
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
      res.json({
        status: 200,
        artist: artistData
      })
    } else {
      res.status(408).json({
        error: 'Incorrect username or password'
      })
    }
  })
}

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin
}
