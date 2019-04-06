import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { getArtInfo } from '../../api'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { checkForValidUser } from '../../helpers/auth'

class ArtDetail extends Component {
  constructor(props) {
    super()
    this.state = {
      artId: props.match.params.id,
      artInfo: {},
      isFetchingArt: false
    }
    checkForValidUser({
      callbackOnFailure: () => this.props.history.push('/login'),
      token: props.artist.token
    })
  }
  saveArtInfo = (art) => {
    const { artInfo, artist } = art.artPiece
    this.setState({
      artInfo: artInfo,
      artist: artist
    })
    this.setState({ isFetchingArt: false })
  }
  componentDidMount() {
    this.setState({ isFetchingArt: true })
    const { artId } = this.state
    getArtInfo(artId, this.saveArtInfo)
  }
  render () {
    const { artInfo, artist, isFetchingArt } = this.state
    const { history } = this.props
    return(<Fragment>
      {!isFetchingArt && artist && <div className='art-detail-container'>
        <div className='art-detail_image-wrapper'>
          <img
            src={artInfo.artImage}
            alt={artInfo.description} />
        </div>
        <div className='art-detail-content'>
          <p className='art-detail_description'>{artInfo.description}</p>
          <p>asking: {artInfo.price}</p>
          <p>created by : {artist.first_name} {artist.last_name}</p>
          {artist.avatar && <img
            onClick={() => history.push(`/artist/${artist.username}`)} 
            className='art-detail_artist-avatar'
            src={artist.avatar} />}
          <p>username: {artist.username}</p>
          <Button
            onClick={() => history.push(`/bid/${artInfo.artId}`)}
            variant='contained'
            color='primary'>make offer</Button>
        </div>
        <div className='art-detail_back-button-container'>
          <Button
            className='art-detail_back-button'
            color='primary'
            onClick={() => history.push('/art')}>back to art</Button>
        </div>
      </div> || <p>Loading...</p>}
    </Fragment>)
  }
}

ArtDetail.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  getArtistArt: PropTypes.func,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user
  }
}

export default connect(mapStateToProps)(ArtDetail)
