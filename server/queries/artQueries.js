const omit = require('lodash/omit')

// importing db models
const { Art } = require('../models/Art')
const { Artist } = require('../models/Artist')

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

module.exports = {
  updateArt,
  getAllArt,
  getArtInfo
}
