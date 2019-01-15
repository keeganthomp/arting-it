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

const port = process.env.PORT || 8080

console.log('')

const httpsOptions = {
  key: fs.existsSync(__dirname + '/../../key.pem') ? fs.readFileSync(__dirname + '/../../key.pem') : '',
  cert: fs.existsSync(__dirname + '/../../cert.pem') ? fs.readFileSync(__dirname + '/../../cert.pem') : ''
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
app.get('/api/artist/:id', db.getArtist)
app.get('/api/art', db.getAllArt)
app.get('/api/art/:id', db.getArtInfo)

app.post('/api/artist/signup', db.createArtist)
app.post('/api/artist/login', db.getArtistLogin)
app.post('/api/me/from/token', db.verifyUser)
app.post('/api/logout', db.logout)

app.patch('/api/artist/:id', db.fileUpload)
app.patch('/api/update/art/:artistId', db.updateArt)

console.log('HTTPS OPTIONSS 11:', httpsOptions)

http.createServer(app).listen(port)
https.createServer(httpsOptions, app).listen(8443)
// app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = router
