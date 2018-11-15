import React, { Component, Fragment } from 'react'
import FileUploader from './ui/fileUploader'
import { getArtist, uploadThing } from '../api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Artpiece from './profile/Artpiece'
import PropTypes from 'prop-types'

class Profile extends Component {
  constructor(props){
    super()
    this.state = {
      artist: props.location.state || null,
      art: [],
      isUpdating: false
    }
  }
  componentDidMount() {
    const { artist } = this.state
    artist && getArtist(artist.id).then(response => {
      this.setState({ 
        artist: response.data.artist
      })
      response.data.artist.art && this.setState({ art: [...response.data.artist.art] })
    })
    !artist && this.props.history.push({
      pathname: '/login',
      state: 'Please login or create an account to view profile.'
    })
  }
  onDrop = (file) => {
    const art = [...this.state.art, file[0]]
    this.setState({ art })
    this.saveAvatar(file)
  }
  saveAvatar = (file) => {
    this.setState({ isUpdating: true })
    const { artist } = this.state
    const reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = () => {
      uploadThing({
        isProfilePicture: true,
        base64encodedImage: reader.result,
        fileName: file[0].name
      }, artist.id).then(res => {
        this.setState({ 
          artist: { 
            ...artist,
            avatar: res.data.updatedProfileImage }, 
          isUpdating: false,
          art: artist.art
        })
      })
    }
  }

  updateArtPortfolio = (file) => {
    this.setState({ isUpdating: true })
    const { artist } = this.state
    this.setState({ file: file })
    const reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = () => {
      uploadThing({
        isProfilePicture: false,        
        base64encodedImage: reader.result,
        fileName: file[0].name,
        image: file
      }, artist.id).then(res => {
        this.setState({ 
          isUpdating: false
        })
        res.data.updatedPortfolio && this.setState({ art: [...res.data.updatedPortfolio] })
      })
    }
  }

  render () {
    const { artist, isUpdating, art } = this.state
    return(
      artist && <Fragment>
        <h3>Hi {artist.username || (artist.first_name + artist.last_name)}!</h3>
       {this.state.source && <img src={this.state.source} alt='' />}
        <FileUploader noPreview className='profile_avatar' onDrop={this.saveAvatar}>
          <div>
            {artist.avatar && <img className='profile_avatar-image' src={artist.avatar}/> ||
            <i className='fas fa-user-alt profile_avatar-icon' />}
          </div>
        </FileUploader>
        <div>
          Would you like to add more art to be sold?
        </div>
        <FileUploader onDrop={this.updateArtPortfolio} isLoading={isUpdating}/>
        <p>Below are your current pieces for sale:</p>
        {artist && !isUpdating && <div className='profile_available-art-container'>
        {console.log('ART BABEE:', art)}
            {art && art.length > 0 && art.map(artPiece => {
              console.log('ARTPIECE:', artPiece)
             const parsedArt = JSON.parse(artPiece)
             return <Artpiece artPiece={parsedArt} allArt={art} artistId={artist.id} key={parsedArt.id}/>
            })}
        </div> || <CircularProgress />}
      </Fragment> 
    )
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default Profile