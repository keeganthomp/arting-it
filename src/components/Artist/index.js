import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtist, getArtistArt } from '../../api'
import { checkForValidUser } from '../../helpers/auth'
import { connect } from 'react-redux'

class ArtistPage extends Component {
  constructor(props) {
    super()
    this.state = {
      isFetchingArtist: false,
      artist: {},
      art: []
    }
    checkForValidUser({
      callbackOnFailure: () => this.props.history.push('/login'),
      token: props.artist.token
    })
  }
  saveArtistToState = (artist) => {
    const { artistId, username } = artist.artist
    this.setState({ 
      artist: artist.artist,
      isFetchingArtist: false
    })
    getArtistArt({
      username,
      artistId 
    }).then(result => {
      const art = result.data.art
      this.setState({ art })
    })
  }
  renderArt = (art) => {
    const { history } = this.props
    return (<div className='artist-detail_art-container'>
      <img onClick={() => history.push(`/art/${art.artId}`)} className='artist-detail_art-image' src={art.artImage} />
      <p>{art.description}</p>
      <p>{art.price}</p>
    </div>)
  }
  componentDidMount() {
    const { match } = this.props
    const artistUsername = match.params.username
    this.setState({ isFetchingArtist: true })
    getArtist(artistUsername, this.saveArtistToState).then(test => console.log('WOOOO', test))
  }
  render () {
    const { isFetchingArtist, art, artist } = this.state
    return(
      !isFetchingArtist && <div className='artist-detail-container'>
        <h1 className='artist-detail_header-text'>all art from {artist.username}</h1>
        {art.length > 0 && art.map(art => {
          return this.renderArt(art)
        })}
      </div> || <p>Fetching Artist art...</p>
    )
  }
}

ArtistPage.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user
  }
}

export default connect(mapStateToProps)(ArtistPage)
