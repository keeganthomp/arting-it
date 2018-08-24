const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const router = express.Router()
const app = express()
const db = require('./queries')

const port = process.env.PORT || 5000

app.use(session({
  key: 'user_sid',
  secret: 'ilovescotchscotchyscotchscotch',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/artists', db.getAllArtists)

app.post('/api/artist/signup', db.createArtist)
app.post('/api/artist/login', db.getArtistLogin)

app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = router