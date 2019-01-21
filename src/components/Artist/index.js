import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtist } from '../../api'

class ArtistPage extends Component {
  constructor() {
    super()
    this.state = {
      isFetchingArtist: false,
      artist: {}
    }
  }
  saveArtistToState = (artist) => {
    this.setState({ 
      artist: artist.artist,
      isFetchingArtist: false
    })
  }
  renderArt = (art) => {
    const { history } = this.props
    return (<div className='artist-detail_art-container'>
      <img onClick={() => history.push(`/art/${art.id}`)} className='artist-detail_art-image' src={art.artImage} />
      <p>{art.description}</p>
      <p>{art.price}</p>
    </div>)
  }
  componentDidMount() {
    const { match } = this.props
    const artistUsername = match.params.username
    this.setState({ isFetchingArtist: true })
    getArtist(artistUsername, this.saveArtistToState)
  }
  render () {
    const { artist, isFetchingArtist } = this.state
    return(
      !isFetchingArtist && artist.art && <div className='artist-detail-container'>
        <h1 className='artist-detail_header-text'>all art from {artist.username}</h1>
        {artist.art && artist.art.length > 0 && artist.art.map(art => {
          const parsedArt = JSON.parse(art)
          return this.renderArt(parsedArt)
        })}
      </div> || <p>Fetching Artist...</p>
    )
  }
}

ArtistPage.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
}

export default ArtistPage