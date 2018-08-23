const express = require('express');
var router = express.Router()
const app = express();
var bodyParser = require('body-parser');

var db = require('./queries')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/artists', db.getAllArtists)
app.post('/api/artist', db.createArtist)



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = router