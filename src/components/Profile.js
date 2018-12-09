import React, { Component, Fragment } from 'react'
import FileUploader from './ui/fileUploader'
import { uploadThing } from '../api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Artpiece from './profile/Artpiece'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkForValidUser } from '../helpers/auth'


class Profile extends Component {
  constructor() {
    super()
    this.state = {
      artist: {},
      art: [],
      isUpdating: false,
      isValidUser: false,
      isCheckingForValidUser: false
    }
  }
  callBackForValidUser = () => {
    this.setState({ isValidUser: true })
  }
  callBackForInValidUser = () => {
    this.props.history.push('login')
  }
  componentDidMount() {
    const { artist } = this.props
    const userFromSession = JSON.parse(sessionStorage.getItem('user'))
    this.setState({ isCheckingForValidUser: true })
    checkForValidUser(this.callBackForValidUser, this.callBackForInValidUser)
    if (userFromSession) {
      this.setState({ artist: userFromSession })
    } else if (artist) {
      this.setState({ artist })
    }
    if (artist && artist.art && artist.art.length > 0) {
      this.setState({ art: artist.art })
    }
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
        const currentUserFromSession = JSON.parse(sessionStorage.getItem('user'))
        const updatedArtist = {...currentUserFromSession}
        updatedArtist.art = [...res.data.updatedPortfolio]
        sessionStorage.setItem('user', JSON.stringify(updatedArtist))
        this.setState({ artist: updatedArtist })
      })
    }
  }

  render () {
    const { artist, isUpdating, art, isValidUser } = this.state
    return(
      isValidUser && <Fragment>
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
          {this.state.artist && this.state.artist.art && this.state.artist.art.length > 0 && this.state.artist.art.map(artPiece => {
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
  history: PropTypes.object,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user
  }
}

export default connect(mapStateToProps)(Profile)