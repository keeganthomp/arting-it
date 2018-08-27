const omit = require('lodash/omit')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/tart')
const { generateHash, validPassword } = require('./helpers/validation')
const b64toBlob = require('b64-to-blob')

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
    type: Sequelize.TEXT
  }
})

Artist.sync({ force: true }).then(() => 'Artists Table Ready')

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
    // console.log('ARTISTTTLL', artist)
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

const getArtist = (req, res) => {
  const { username } = req.body
  Artist.findOne({
    where: {
      id
    }
  }).then(artist => {
    if (artist) {
      res.json({
        status: 200,
        artist
      })
    } else {
      res.status(408).json({
        error: 'No Artist Found'
      })
    }
  })
}

const updateArtist = (req, res) => {
  console.log('UPDATING ARTISTTTTTTTT')
  console.log('REQ BODy IN uPDATE::', req.body.avatar)
  Artist.update(
    { avatar: req.body.avatar },
    { where: { id: req.params.id } }
  ).then(updatedArtist => {
    console.log('updateARTISTT:', updateArtist)
    if (updatedArtist) {
      res.json({
        status: 200,
        woo: 'UPDATEDDD',
        updatedArtist
      })
    } else {
      res.status(408).json({
        error: 'UNABLE TO UPDATE ARTIST'
      })
    }
  })
}

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin,
  getArtist,
  updateArtist
}
