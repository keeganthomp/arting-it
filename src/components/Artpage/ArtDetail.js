import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtInfo } from '../../api'

class ArtDetail extends Component {
  constructor(props) {
    super()
    this.state = {
      artId: props.match.params.id,
      artInfo: {},
      isFetchingArt: false
    }
  }
  saveArtInfo = (artInfo) => {
    this.setState({ artInfo: artInfo.artPiece })
    this.setState({ isFetchingArt: false })
  }
  componentDidMount() {
    this.setState({ isFetchingArt: true })
    const { artId } = this.state
    getArtInfo(artId, this.saveArtInfo)
  }
  render () {
    const { artInfo, isFetchingArt } = this.state
    const { history } = this.props
    const artist = artInfo.artist
    return(
      !isFetchingArt && artist && <div className='art-detail-container'>
        <div className='art-detail_image-wrapper'>
          <img src={artInfo.artImage} alt={artInfo.description} />
        </div>
        <div>
          <p>{artInfo.description}</p>
          <p>Asking: {artInfo.price}</p>
          <p>created by : {artist.first_name} {artist.last_name}</p>
          <p>username: {artist.username}</p>
          <button>make offer</button>
        </div>
        <div>      
          <button onClick={() => history.push('/art')}>go back</button>
        </div>
      </div> || <p>Loading...</p>
    )
  }
}

ArtDetail.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
}

export default ArtDetail