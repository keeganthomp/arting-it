import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getArtInfo } from '../../api'
import Button from '@material-ui/core/Button'

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
        <div className='art-detail-content'>
          <p className='art-detail_description'>{artInfo.description}</p>
          <p>asking: {artInfo.price}</p>
          <p>created by : {artist.first_name} {artist.last_name}</p>
          {artist.avatar && <img onClick={() => history.push(`/artist/${artist.id}`)} className='art-detail_artist-avatar' src={artist.avatar} />}
          <p>username: {artist.username}</p>
          <Button variant='contained' color='primary'>make offer</Button>
        </div>
        <div className='art-detail_back-button-container'>
          <Button className='art-detail_back-button' color='primary' onClick={() => history.push('/art')}>back to art</Button>
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