const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')

const router = express.Router()
const app = express()
const db = require('./queries')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 8080

app.use((req, res, next) => {
  console.log('GOOOATZZZ')
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization']
  if (!token) return next() //if no token, continue

  token = token.replace('Bearer ', '')
  console.log('TOKE NIN SERVERR:', token)

  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    console.log('WOOOO TOWNNN')
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      })
    } else {
      req.user = user //set the user to req so other routes can use it
      next()
    }
  })
})
app.use(session({
  key: 'user_sid',
  secret: 'ilovescotchscotchyscotchscotch',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/api/artists', db.getAllArtists)

app.post('/api/artist/signup', db.createArtist)
app.post('/api/artist/login', db.getArtistLogin)
app.get('/api/artist/:id', db.getArtist)
app.patch('/api/artist/:id', db.fileUpload)
app.patch('/api/update/art/:artistId', db.updateArt)
app.get('/api/art', db.getAllArt)
app.post('/api/me/from/token', db.verifyUser)
app.post('/api/logout', db.logout)

app.use( express.static( `${__dirname}/../build` ))

app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = router
