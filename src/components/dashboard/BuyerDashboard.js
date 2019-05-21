import React, { Component } from 'react'
import FileUploader from '../ui/fileUploader'
import { uploadThing } from 'api'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'

class BuyerDashboard extends Component {
  constructor() {
    super()
    this.state = {
      isUpdating: false,
      isValidUser: false,
      isAvatarOverlayActive: false
    }
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
      }, artist.artistId).then(res => {
        this.setState({ 
          artist: { 
            ...artist,
            avatar: res.data.updatedProfileImage }, 
          isUpdatingAvatar: false
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

  render () {
    const { isUpdatingAvatar } = this.state
    const { buyer } = this.props
    const avatarOverlayClasses = classnames('profile_avatar-image-overlay', {
      'profile_avatar-image-overlay--active': this.state.isAvatarOverlayActive
    })
    const avatarOverlayPencilIconClasses = classnames('profile_avatar-edit-icon', {
      'profile_avatar-edit-icon--active': this.state.isAvatarOverlayActive
    })
    return(     
      <div>
        <h3 className='profile-header'>Hi Buyer! | {buyer.username}!</h3>
        <div className='profile-main-content'>
          {this.state.source && <img src={this.state.source} alt='' />}
          {!isUpdatingAvatar && <FileUploader
            noPreview
            className='profile_avatar'
            onDrop={this.saveAvatar}>
            <div
              className='profile_avatar-image-container'
              onMouseEnter={() => this.setState({ isAvatarOverlayActive: true })}
              onMouseLeave={() => this.setState({ isAvatarOverlayActive: false })}>
              <div className={avatarOverlayClasses}>
                <i className={`fas fa-pencil-alt ${avatarOverlayPencilIconClasses}`} />
              </div>
              {buyer.avatar && <img
                className='profile_avatar-image' src={buyer.avatar}/> ||
              <i
                className='fas fa-user-alt profile_avatar-icon' />}
            </div>
          </FileUploader> || <CircularProgress />}
        </div>
      </div> 
    )
  }
}

BuyerDashboard.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  buyer: PropTypes.object,
  addArt: PropTypes.func,
  art: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    buyer: state.user.buyer
  }
}

export default connect(mapStateToProps)(BuyerDashboard)
