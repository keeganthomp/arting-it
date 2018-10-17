const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const router = express.Router()
const app = express()
const db = require('./queries')

const port = process.env.PORT || 8080

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

app.get('/api/artists', db.getAllArtists)

app.post('/api/artist/signup', db.createArtist)
app.post('/api/artist/login', db.getArtistLogin)
app.get('/api/artist/:id', db.getArtist)
app.patch('/api/artist/:id', db.fileUpload)
app.patch('/api/update/art/:artistId', db.updateArt)
app.use( express.static( `${__dirname}/../build` ) )
// app.get('*', (req, res)=>{
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// })

app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = router