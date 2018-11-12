import React, { Component } from 'react'
import { updateArt } from '../../api'

class Artpiece extends Component {
  constructor(props) {
    super()
    this.state = {
      artPiece: {},
      artDescription: '',
      artPrice: ''
    }
  }
  componentDidMount() {
    const { artPiece, allArt } = this.props
    if (typeof artPiece === 'string') {
      this.setState({
         artPiece: JSON.parse(artPiece),
         artPrice: JSON.parse(artPiece).price,
         artDescription: JSON.parse(artPiece).description,
     })
    } else {
      this.setState({
        artPiece,
        artPrice: artPiece.price,
        artDescription: artPiece.description
      })
    }
  }
  updateArtPieceMeta = (e) => {
    e.preventDefault()
    const { allArt, artistId } = this.props
    const { artDescription, artPrice, artPiece } = this.state
    const parsedArt = allArt.map(art => JSON.parse(art))
    const artToUpdate = parsedArt.find(element => element.id === artPiece.id)
    const indexOfItemToUpdate = parsedArt.indexOf(artToUpdate)
    const updatedArtPiece = {
      ...artToUpdate,
      price: artPrice || artToUpdate.price,
      description: artDescription || artToUpdate.description
    }
    parsedArt[indexOfItemToUpdate] = updatedArtPiece
    const artForDb = JSON.stringify(parsedArt)
    updateArt(artForDb, artistId)
  }
  render() {
    const { artDescription, artPrice, artPiece } = this.state
    return(
    <div className='profile_available-art-image-container'>
      <img className='profile_available-art-image' src={artPiece.artImage} alt='' />
      <form className='profile_available-art-info-container' onSubmit={(e) => this.updateArtPieceMeta(e)}>
        <input type='text' value={artDescription} name='art-description' onChange={e => this.setState({ artDescription: e.target.value })}/>
        <input type='text' value={artPrice} name='art-price' onChange={e => this.setState({ artPrice: e.target.value })}/>
        <button>Submit</button>
      </form>
    </div>
    )
  }
}

  export default Artpiece
