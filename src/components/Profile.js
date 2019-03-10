import React, { Component, Fragment } from 'react'
import FileUploader from './ui/fileUploader'
import { uploadThing, getStripeToken } from '../api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Artpiece from './profile/Artpiece'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkForValidUser } from '../helpers/auth'
import classnames from 'classnames'
import PlaidLink from 'react-plaid-link'
import Spinner from 'react-spinkit'
import { addArt } from '../actions/artActions'

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
    const isUserFromSession = sessionStorage.getItem('user') && (sessionStorage.getItem('user') !== 'undefined')
    const isArtInSession = sessionStorage.getItem('art') && (sessionStorage.getItem('art') !== '[]')
    this.setState({ isCheckingForValidUser: true })
    checkForValidUser({
      callbackOnSuccess: this.callBackForValidUser,
      callbackOnFailure: this.callBackForInValidUser
    })
    if (isUserFromSession) {
      this.setState({ artist: JSON.parse(sessionStorage.getItem('user')) })
    } else if (artist) {
      this.setState({ artist })
    }
    if (isArtInSession) {
      const artFromSession = JSON.parse(sessionStorage.getItem('art'))
      this.setState({ art: artFromSession })
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

  exchangePlaidTokenForStripeBankToken = (token, metaData) => {
    const accountId = metaData.account_id
    this.setState({
      bankToken: token,
      accountId
    })
    getStripeToken({ accountId, accesToken: token }).then(response => {
      console.log('RESPONSE:', response)
    })
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
      }, artist.artistId).then(res => {
        this.setState({ 
          isUpdating: false
        })
        const newArtPiece = res.data.artpiece
        newArtPiece && this.setState({ art: [...this.state.art, newArtPiece] })
        this.props.addArt({
          payload: newArtPiece
        })
        const isUserInSession = sessionStorage.getItem('user') !== 'undefined'
        const currentUserFromSession = isUserInSession && JSON.parse(sessionStorage.getItem('user'))
        const updatedArtist = {...currentUserFromSession}
        updatedArtist.art = [...this.state.art]
        const artFromSession = JSON.parse(sessionStorage.getItem('art'))
        sessionStorage.setItem('art', JSON.stringify([ ...artFromSession, newArtPiece ]))
        this.setState({ artist: updatedArtist })
      })
    }
  }

  render () {
    const { artist, isUpdating, isValidUser, art, isUpdatingAvatar } = this.state
    const plaidDevSecret = process.env.REACT_APP_PLAID_DEV_SECRET
    const bankToken = sessionStorage.getItem('bankToken')
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
              {artist.avatar && <img
                className='profile_avatar-image' src={artist.avatar}/> ||
              <i
                className='fas fa-user-alt profile_avatar-icon' />}
            </div>
          </FileUploader> || <CircularProgress />}
          {/* can use onExit prop to fire when the user exits plaid plugin */}
          {!bankToken && <PlaidLink
            clientName='Teal Eel'
            env='sandbox'
            product={['auth', 'transactions']}
            publicKey={plaidDevSecret}
            className='weee'
            onSuccess={(token, metaData) => this.exchangePlaidTokenForStripeBankToken(token, metaData)}>
            <span><i className='fas fa-dollar-sign' />Click Here to link your bank account</span>
          </PlaidLink> || <p>Your bank account has been linked. Feel free to begin bidding on art.</p>}
          <div className='profile_file-upload-wrapper'>
            {!isUpdating && <FileUploader
              className='profile_art-upload-zone'
              onDrop={this.updateArtPortfolio}
              isLoading={isUpdating}
            /> || <Fragment>
              <div className='profile_loader'>
                <Spinner name="ball-triangle-path" fadeIn='none' />
              </div>
            </Fragment>}
          </div>
          <p>{isUpdating ? '' : this.state.art.length > 0 ? 'Below are your current pieces for sale:' : 'It looks like you have not uploaded any art yet.'}</p>
          {artist && <div className='profile_available-art-container'>
            {this.state.art.length > 0 && this.state.art.map(artPiece => {
              return <Artpiece artPiece={artPiece} allArt={art} artistId={artPiece.artistId} key={artPiece.artId}/>
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
  artist: PropTypes.object,
  addArt: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    artist: state.user
  }
}

const mapDispatchToProps = {
  addArt
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
