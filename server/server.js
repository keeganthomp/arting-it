const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
// const path = require('path')

const router = express.Router()
const app = express()
const https = require('https')
const http = require('http')
const db = require('./queries')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const port = process.env.PORT || 80

const httpsOptions = {
  key: fs.existsSync(__dirname + '/../../privkey.pem') ? fs.readFileSync(__dirname + '/../../privkey.pem') : '',
  cert: fs.existsSync(__dirname + '/../../cert.pem') ? fs.readFileSync(__dirname + '/../../cert.pem') : '',
  ca: fs.existsSync(__dirname + '/../../chain.pem.pem') ? fs.readFileSync(__dirname + '/../../chain.pem.pem') : ''
}

app.use((req, res, next) => {
  const isSignupRoute = req.path === '/api/artist/signup'
  const isLoginRoute = req.path ==='/api/artist/login'
  // check header or url parameters or post parameters for token
  let token = req.headers['authorization']
  if (!token) return next() //if no token, continue

  token = token.replace('Bearer ', '')

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err && !isSignupRoute && !isLoginRoute) {
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
app.use(express.static(__dirname + '/public'))
app.use( express.static( `${__dirname}/../build` ))
app.use(express.static(__dirname, { dotfiles: 'allow' } ))

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
//     if (err) {
//       res.status(500).send(err)
//     }
//   })
// })
// app.get('*', function (request, response){
//   response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })
app.get('/api/artists', db.getAllArtists)
app.get('/api/artist/:username', db.getArtist)
app.get('/api/art', db.getAllArt)
app.get('/api/art/:id', db.getArtInfo)
app.get('/api/artist/:username/art', db.getArtistArt)

app.post('/api/artist/signup', db.createArtist)
app.post('/api/artist/login', db.getArtistLogin)
app.post('/api/me/from/token', db.verifyUser)
app.post('/api/logout', db.logout)
app.post('/api/get_access_token', db.getPlaidAccessToken)
app.post('/api/schedule/message', db.scheduleText)

app.patch('/api/artist/:id', db.fileUpload)
app.patch('/api/update/art/:artistId', db.updateArt)

http.createServer(app).listen(port)
https.createServer(httpsOptions, app).listen(443)
module.exports = router
