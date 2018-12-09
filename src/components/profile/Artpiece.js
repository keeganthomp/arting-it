import React, { Component } from 'react'
import { updateArt } from '../../api'
import PropTypes from 'prop-types'

class Artpiece extends Component {
  constructor() {
    super()
    this.state = {
      artPiece: {},
      artDescription: '',
      artPrice: '',
      artPieceType: ''
    }
  }
  componentDidMount() {
    const { artPiece } = this.props
    if (typeof artPiece === 'string') {
      this.setState({
        artPiece: JSON.parse(artPiece),
        artPrice: JSON.parse(artPiece).price,
        artDescription: JSON.parse(artPiece).description,
        artPieceType: JSON.parse(artPiece).type
      })
    } else {
      this.setState({
        artPiece,
        artPrice: artPiece.price,
        artDescription: artPiece.description,
        artPieceType: artPiece.type
      })
    }
  }
  updateArtPieceMeta = (e) => {
    e.preventDefault()
    const { allArt, artistId } = this.props
    const { artDescription, artPrice, artPiece, artPieceType } = this.state
    const parsedArt = allArt.map(art => JSON.parse(art))
    const artToUpdate = parsedArt.find(element => element.id === artPiece.id)
    const indexOfItemToUpdate = parsedArt.indexOf(artToUpdate)
    const updatedArtPiece = {
      ...artToUpdate,
      price: artPrice || artToUpdate.price,
      description: artDescription || artToUpdate.description,
      type: artPieceType || artToUpdate.type
    }
    parsedArt[indexOfItemToUpdate] = updatedArtPiece
    const artForDb = parsedArt.map(art => JSON.stringify(art))
    updateArt(artForDb, artistId)
  }
  render() {
    const { artDescription, artPrice, artPiece, artPieceType } = this.state
    return(
      <div className='profile_available-art-image-container'>
        <img className='profile_available-art-image' src={artPiece.artImage} alt='' />
        <form className='profile_available-art-info-container' onSubmit={(e) => this.updateArtPieceMeta(e)}>
          <input type='text' value={artDescription} name='art-description' onChange={e => this.setState({ artDescription: e.target.value })}/>
          <input type='text' value={artPrice} name='art-price' onChange={e => this.setState({ artPrice: e.target.value })}/>
          <select name='art-type' value={artPieceType} onChange={e => this.setState({ artPieceType: e.target.value })}>
            <option value='painting'>Painting</option>
            <option value='drawing'>Drawing</option>
            <option value='photography'>Photography</option>
          </select>
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

Artpiece.propTypes = {
  artPiece: PropTypes.object,
  allArt: PropTypes.array,
  artistId: PropTypes.number
}

export default Artpiece
