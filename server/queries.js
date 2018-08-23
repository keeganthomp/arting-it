var promise = require('bluebird')

var options = {
  // Initialization Options
  promiseLib: promise
}

var pgp = require('pg-promise')(options)
var connectionString = 'postgres://localhost:5432/tart'
var db = pgp(connectionString)

// add query functions

const getAllArtists = (req, res, next) => {
  db.any('select * from artists')
  .then((data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL artists'
      })
  })
  .catch((err) => {
    console.log('ERROR:', err)
    return next(err)
  })
}

const createArtist = (req, res, next) => {
  const { firstName, last_name, sex, location, age, specialty} = req.body
  db.none('insert into artists(first_name, last_name, sex, location, age, specialty)' +
  'values(${first_name}, ${last_name}, ${sex}, ${location}, ${age}, ${specialty})', req.body)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Inserted one artist'
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

module.exports = {
  getAllArtists: getAllArtists,
  createArtist: createArtist
}