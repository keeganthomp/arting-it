import React, { Component, Fragment } from 'react'
import FileUploader from './ui/fileUploader'
import { uploadThing, getStripeToken } from '../api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Artpiece from './profile/Artpiece'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkForValidUser } from '../helpers/auth'
import classnames from 'classnames'
// import PlaidLink from 'react-plaid-link'
import Spinner from 'react-spinkit'
import { addArt } from '../actions/artActions'
import { getArtistArt } from 'api'
import StripeButton from './ui/stripeButton'

class Profile extends Component {
  constructor(props) {
    super()
    this.state = {
      artist: {},
      art: props.art || [],
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
    const { artist, token } = this.props.artist
    const isUserFromSession = (sessionStorage.getItem('user') && (sessionStorage.getItem('user') !== 'undefined'))
    this.setState({ isCheckingForValidUser: true })
    checkForValidUser({
      callbackOnSuccess: this.callBackForValidUser,
      callbackOnFailure: this.callBackForInValidUser,
      token
    })
    if (isUserFromSession) {
      this.setState({ artist: JSON.parse(sessionStorage.getItem('user')) })
    } else if (artist) {
      this.setState({ artist })
      getArtistArt({
        username: artist.username,
        artistId: artist.artistId
      }).then(result => {
        const art = result.data.art
        this.setState({ art: [ ...art ] })
      })
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
        this.setState({ artist: updatedArtist })
      })
    }
  }

  render () {
    const { artist, isUpdating, isValidUser, isUpdatingAvatar, art } = this.state
    const stripeClientId = 'ca_EffV60ZGfT5OB2IOBh9CvoWH7mgHrpDJ'
    const redirectUri = 'http://localhost:5300/'
    const token = 'userToken'
    const stripeConnectUrl = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${redirectUri}&client_id=${stripeClientId}&state=${token}`
    // const plaidDevSecret = process.env.REACT_APP_PLAID_DEV_SECRET
    // const bankToken = sessionStorage.getItem('bankToken')
    const avatarOverlayClasses = classnames('profile_avatar-image-overlay', {
      'profile_avatar-image-overlay--active': this.state.isAvatarOverlayActive
    })
    const avatarOverlayPencilIconClasses = classnames('profile_avatar-edit-icon', {
      'profile_avatar-edit-icon--active': this.state.isAvatarOverlayActive
    })
    return(
      
      isValidUser && <div>

        <h3 className='profile-header'>Hi {artist.username || (artist.first_name + artist.last_name)}!</h3>
        <StripeButton />
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
          {/* {!bankToken && <PlaidLink
            clientName='Teal Eel'
            env='sandbox'
            product={['auth', 'transactions']}
            publicKey={plaidDevSecret}
            className='weee'
            onSuccess={(token, metaData) => this.exchangePlaidTokenForStripeBankToken(token, metaData)}>
            <span><i className='fas fa-dollar-sign' />Click Here to link your bank account</span>
          </PlaidLink> || <p>Your bank account has been linked. Feel free to begin bidding on art.</p>} */}
          <button onClick={() => window.location.href = stripeConnectUrl}>WOOOO</button>
          {/* <Checkout /> */}
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
          <p>{isUpdating
            ? ''
            : (this.state.art && this.state.art.length > 0) 
              ? 'Below are your current pieces for sale:'
              : 'It looks like you have not uploaded any art yet.'}</p>
          {artist && <div className='profile_available-art-container'>
            {art.length > 0 && art.map(artPiece => {
              return <Artpiece artPiece={artPiece} allArt={art} artistId={artPiece.artistId} key={artPiece.artId}/>
            })}
          </div>}
        </div>
      </div> 
    )
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  artist: PropTypes.object,
  addArt: PropTypes.func,
  art: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    artist: state.user,
    art: state.art.artPieces
  }
}

const mapDispatchToProps = {
  addArt
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
