const omit = require('lodash/omit')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('tart', 'keegan', 'hu8jmn3', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const { generateHash, validPassword } = require('./helpers/validation')
const b64toBlob = require('b64-to-blob')
const fs = require('fs')
const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')
const s3 = new AWS.S3()

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
  },
  art: {
    type: Sequelize.ARRAY(Sequelize.STRING)
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
      res.status(400).json({
        error: 'Incorrect username or password'
      })
    }
  })
}

const getArtist = (req, res) => {
  Artist.findOne({
    where: {
      id: req.params.id
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

const updateArtist = (req, res) => {
  // const updatedAvatar = b64toBlob(req.body.avatar, 'image/png')
  const bufffer = Buffer.from(req.body.avatar, 'base64')
  fs.writeFile("./temp/test.jpeg", bufffer, function(err) {
    if(err) {
      console.log("err", err)
    } else {
      console.log('WOOOOO')
    }
  })
  Artist.update(
    { avatar: 'bufffer' },
    { where: { id: req.params.id } }
  ).then(updatedArtist => {
    if (updatedArtist) {
      res.json({
        status: 200,
        woo: 'UPDATEDDD',
        updatedArtist
      })
    } else {
      res.status(400).json({
        error: 'UNABLE TO UPDATE ARTIST'
      })
    }
  })
}


const uploadToS3 = (props) => {
  const { base64encodedImage, fileName, bucket, res, userId } = props
  const myBucket = bucket
  const myKey = fileName
  const buff = new Buffer(base64encodedImage.replace(/^data:image\/\w+base64,/, ''),'base64')
  s3.createBucket({ Bucket: myBucket }, function(err, data) {
  if (err) {
    console.log('ERRORR 11::', err)
    res.status(400).json({
      error: 'Unable to upload image'
    })
    } else {
      params = { Bucket: myBucket, Key: fileName, Body: buff }
      s3.upload(params, (err, data) => {
        if (err) {
            console.log('ERRORR 22:', err)
            res.status(400).json({
              error: 'Unable to upload image'
            })
          } else {
            if (bucket === 'artist-profile-images' ) {
             Artist.update(
              { avatar: `https://s3.amazonaws.com/${bucket}/${data.key}` },
              { returning: true, where: { id: userId } }
            ).then(([rowsUpdated, [artistWithUpdatedProfilePicture]]) => {
              if (artistWithUpdatedProfilePicture) {
                res.json({
                  status: 200,
                  message: 'Successfully updated profile image',
                  updatedProfileImage: artistWithUpdatedProfilePicture.avatar
                })
              } else {
                res.status(400).json({
                  error: 'UNABLE TO UPDATE ARTIST PROFILE'
                })
              }
            })
          } else {
            const artPiece = JSON.stringify({
              id: uuidv1(),
              price: '$6.66',
              description: 'Some description about the art',
              artImage: `https://s3.amazonaws.com/${bucket}/${data.key}`
            })
            Artist.update(
              { 'art': sequelize.fn('array_append', sequelize.col('art'), artPiece) },
              { returning: true, where: { id: userId } }
            ).then(([rowsUpdated, [artistWithUpdatedPortfolio]]) => {
              if (artistWithUpdatedPortfolio.art) {
                res.json({
                  status: 200,
                  message: 'Successfully added art to art image',
                  updatedPortfolio: artistWithUpdatedPortfolio.art
                })
              } else {
                res.status(400).json({
                  error: 'UNABLE TO UPDATE ARTIST IMAGESSS'
                })
              }
            })
          }
         }
      })
    }
  })
}

const fileUpload = (req, res) => {
  const { isProfilePicture, base64encodedImage, fileName, price, description } = req.body
  if (isProfilePicture) {
    uploadToS3({
      base64encodedImage: req.body.base64encodedImage,
      fileName: req.body.fileName,
      bucket: 'artist-profile-images',
      res,
      userId: req.params.id 
    })
   } else {
      uploadToS3({
        base64encodedImage: req.body.base64encodedImage,
        fileName: req.body.fileName,
        bucket: 'artist-portfolio-images',
        res,
        userId: req.params.id,
        price,
        description
      }) 
    }
  }

  const updateArt = (req, res) => {
    Artist.update(
      { 'art': [...JSON.stringify(req.body)] },
      { returning: true, where: { id: req.params.artistId } }
    ).then(([rowsUpdated, [artistWithUpdatedPortfolio]]) => {
      if (artistWithUpdatedPortfolio.art) {
        res.json({
          status: 200,
          message: 'Successfully updated art',
          updatedPortfolio: artistWithUpdatedPortfolio.art
        })
      } else {
        res.status(400).json({
          error: 'UNABLE TO UPDATE ARTTTTTTTT'
        })
      }
    })
  }

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin,
  getArtist,
  updateArtist,
  fileUpload,
  updateArt
}
