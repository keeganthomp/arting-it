import React, { Component, Fragment } from 'react'
import FileUploader from './ui/fileUploader'
import { uploadThing } from '../api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Artpiece from './profile/Artpiece'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkForValidUser } from '../helpers/auth'
import classnames from 'classnames'


class Profile extends Component {
  constructor() {
    super()
    this.state = {
      artist: {},
      art: [],
      isUpdating: false,
      isValidUser: false,
      isCheckingForValidUser: false,
      isAvatarOverlayActive: false
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
    console.log('ARTISTTTTTL', artist)
    const isUserFromSession = sessionStorage.getItem('user') && sessionStorage.getItem('user') !== 'undefined'
    this.setState({ isCheckingForValidUser: true })
    checkForValidUser(this.callBackForValidUser, this.callBackForInValidUser)
    if (isUserFromSession) {
      this.setState({ artist: JSON.parse(sessionStorage.getItem('user')) })
    } else if (artist) {
      this.setState({ artist })
    }
    if (artist && artist.art && artist.art.length > 0) {
      this.setState({ art: artist.art })
    } else if (isUserFromSession && JSON.parse(sessionStorage.getItem('user')).art && JSON.parse(sessionStorage.getItem('user')).art.length > 0) {
      this.setState({ art: JSON.parse(sessionStorage.getItem('user')).art })
    }
  }
  onDrop = (file) => {
    const art = [...this.state.art, file[0]]
    this.setState({ art })
    this.saveAvatar(file)
  }
  saveAvatar = (file) => {
    this.setState({ isUpdatingAvatar: true })
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
          isUpdatingAvatar: false,
          art: artist.art
        })
        const isUserInSession = sessionStorage.getItem('user') !== 'undefined'
        const currentUserFromSession = isUserInSession && JSON.parse(sessionStorage.getItem('user'))
        const updatedArtist = {...currentUserFromSession}
        updatedArtist.avatar = res.data.updatedProfileImage
        sessionStorage.setItem('user', JSON.stringify(updatedArtist))
        this.setState({ artist: updatedArtist })
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
        fileName: file[0].name.replace('+', '_'),
        image: file
      }, artist.id).then(res => {
        this.setState({ 
          isUpdating: false
        })
        res.data.updatedPortfolio && this.setState({ art: [...res.data.updatedPortfolio] })
        const isUserInSession = sessionStorage.getItem('user') !== 'undefined'
        const currentUserFromSession = isUserInSession && JSON.parse(sessionStorage.getItem('user'))
        const updatedArtist = {...currentUserFromSession}
        updatedArtist.art = [...res.data.updatedPortfolio]
        sessionStorage.setItem('user', JSON.stringify(updatedArtist))
        this.setState({ artist: updatedArtist })
      })
    }
  }

  render () {
    const { artist, isUpdating, isValidUser, art, isUpdatingAvatar } = this.state
    const avatarOverlayClasses = classnames('profile_avatar-image-overlay', {
      'profile_avatar-image-overlay--active': this.state.isAvatarOverlayActive
    })
    const avatarOverlayPencilIconClasses = classnames('profile_avatar-edit-icon', {
      'profile_avatar-edit-icon--active': this.state.isAvatarOverlayActive
    })
    return(
      isValidUser && <Fragment>
        <h3 className='profile-header'>Hi {artist.username || (artist.first_name + artist.last_name)}!</h3>
        <div className='profile-main-content'>
          {this.state.source && <img src={this.state.source} alt='' />}
          {!isUpdatingAvatar && <FileUploader noPreview className='profile_avatar' onDrop={this.saveAvatar}>
            <div
              className='profile_avatar-image-container'
              onMouseEnter={() => this.setState({ isAvatarOverlayActive: true })}
              onMouseLeave={() => this.setState({ isAvatarOverlayActive: false })}>
              <div className={avatarOverlayClasses}>
                <i className={`fas fa-pencil-alt ${avatarOverlayPencilIconClasses}`} />
              </div>
              {artist.avatar && <img
                className='profile_avatar-image' src={artist.avatar}/> ||
              <i
                className='fas fa-user-alt profile_avatar-icon' />}
            </div>
          </FileUploader> || <CircularProgress />}
          {!isUpdating && <FileUploader className='profile_art-upload-zone' onDrop={this.updateArtPortfolio} isLoading={isUpdating}/> || <Fragment>
            <CircularProgress />
            <p>Adding Art</p>
          </Fragment>}
          <p>{isUpdating ? '' : 'Below are your current pieces for sale:'}</p>
          {artist && <div className='profile_available-art-container'>
            {this.state.artist && this.state.artist.art && this.state.artist.art.length > 0 && this.state.artist.art.map(artPiece => {
              const parsedArt = JSON.parse(artPiece)
              return <Artpiece artPiece={parsedArt} allArt={art} artistId={artist.id} key={parsedArt.id}/>
            })}
          </div>}
        </div>
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