const { generateToken } = require('./helpers/utils')

const omit = require('lodash/omit')
const Sequelize = require('sequelize')
const path = require('path')
const jwt = require('jsonwebtoken')

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
const fs = require('fs')
const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  'region': 'sa-east-1'
})

const uuidv1 = require('uuid/v1')
const s3 = new AWS.S3()


const Artist = sequelize.define('artist', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5,17]
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
    type: Sequelize.STRING
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

const updateArtist = (req, res) => {
  const bufffer = Buffer.from(req.body.avatar, 'base64')
  const  tempDirectory = './temp'
  if (!fs.existsSync(tempDirectory)){
    fs.mkdirSync(tempDirectory)
  }
  fs.writeFile('./temp/test.jpeg', bufffer, (err) => {
    if(err) {
      console.log('err', err)
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
  const imageForDisk = base64encodedImage.split(';base64,').pop()
  const  tempDirectory = __dirname + '/temp'
  if (!fs.existsSync(tempDirectory)){
    fs.mkdirSync(tempDirectory)
  }
  fs.writeFile(path.join(__dirname + `/temp/${fileName}`), imageForDisk, { encoding: 'base64' }, (err) => {
    err && console.log('ERROR WRITING FILE:', err)
  })
  setTimeout(() => {
    s3.createBucket({ Bucket: myBucket }, (err) => {
      // image names cannot have '+' signs in the file name
      console.log('ERRRORRR:', err)
      const imageToUpload = fs.createReadStream(path.join(__dirname + `/temp/${fileName}`))
      if (err && (err.code !== 'BucketAlreadyOwnedByYou' || err.BucketAlreadyOwnedByYou)) {
        res.status(400).json({
          error: 'Unable to upload image'
        })
      } else {
        const params = { 
          Bucket: myBucket,
          Key: fileName,
          Body: imageToUpload,
          ContentEncoding: 'base64',
          type: 'image/jpeg',
          region: 'us-east-1'
        }
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('ERRRR:', err)
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
                artImage: `https://s3.amazonaws.com/${bucket}/${data.key}`,
                type: 'painting'
              })
              Artist.update(
                { 'art': sequelize.fn('array_append', sequelize.col('art'), artPiece) },
                { returning: true, where: { id: userId } }
              ).then(([rowsUpdated, [artistWithUpdatedPortfolio]]) => {
                fs.unlink(path.join(__dirname + `/temp/${fileName}`), () => console.log('FILE REMOVED'))
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
  },2000)
}

const fileUpload = (req, res) => {
  const { isProfilePicture, base64encodedImage, fileName, price, description, image } = req.body
  if (isProfilePicture) {
    uploadToS3({
      base64encodedImage: base64encodedImage,
      fileName,
      bucket: 'artist-profile-images',
      res,
      userId: req.params.id 
    })
  } else {
    uploadToS3({
      base64encodedImage: base64encodedImage,
      fileName,
      bucket: 'artist-portfolio-images',
      res,
      userId: req.params.id,
      price,
      description,
      image
    }) 
  }
}

const updateArt = (req, res) => {
  Artist.update(
    { 'art': req.body },
    { returning: true, where: { id: req.params.artistId } }
  ).then(([rowsUpdated, [artistWithUpdatedPortfolio]]) => {
    if (artistWithUpdatedPortfolio.art) {
      res.json({
        status: 200,
        message: 'Successfully updated art',
        artistWithUpdatedArt: artistWithUpdatedPortfolio
      })
    } else {
      res.status(400).json({
        error: 'UNABLE TO UPDATE ARTT'
      })
    }
  })
}

const getAllArt = (req, res) => {
  Artist.findAll().then((data) => {
    const artists = data
    const allArt = artists.reduce((art, currentArtist) => {
      return art.concat(currentArtist.art.map(art => art))
    }, [])
    res.json({
      status: 200,
      message: 'Successfully got all art',
      art: allArt
    })
  })
}

const verifyUser = (req, res) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token
  if (!token) {
    return res.status(401).json({message: 'Must pass token'})
  }
  // Check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) throw err

    //return user using the id from w/in JWTToken
    const artist = await Artist.findByPk(user.id)
    res.json(artist)
  })
}

const getArtInfo = (req, res) => {
  const artId = req.params.id
  Artist.findAll().then((data) => {
    const artists = data
    const allArt = artists.reduce((art, currentArtist) => {
      return art.concat(currentArtist.art.map(artPiece => {
        const parsedArtPiece = JSON.parse(artPiece)
        const normalizedArtist = omit(currentArtist.dataValues, ['password'])
        return { ...parsedArtPiece, artist: normalizedArtist }
      }))
    }, [])
    const selectedArt = allArt.find(art => art.id === artId)
    res.json({
      status: 200,
      message: 'Successfully retrieved art info',
      artPiece: selectedArt
    })
  })

}

const getPlaidAccessToken = (req, res) => {
  console.log('WOOOOOOO THS IS WHERE::√')
  console.log('ACCESS TOKEN IS BEING SET ON BACKEND::', req.body)
}

const logout = (req, res) => {
  req.session.destroy()
}

module.exports = {
  getAllArtists,
  createArtist,
  getArtistLogin,
  getArtist,
  updateArtist,
  fileUpload,
  updateArt,
  getAllArt,
  verifyUser,
  getArtInfo,
  logout,
  getPlaidAccessToken
}
