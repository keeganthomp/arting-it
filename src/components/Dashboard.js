import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkForValidUser } from '../helpers/auth'
// import PlaidLink from 'react-plaid-link'
import { addArt } from '../actions/artActions'
import { getArtistArt } from 'api'
import ArtistDashboard from './dashboard/ArtistDashboard'
import BuyerDashboard from './dashboard/BuyerDashboard'

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      isValidUser: false
    }
  }
  callBackForValidUser = () => {
    this.setState({ isValidUser: true })
  }
  callBackForInValidUser = () => {
    this.props.history.push('login')
  }
  componentDidMount() {
    const artist = this.props.user
    const { token } = this.props
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
  

  render () {
    const { isValidUser } = this.state
    const { user } = this.props
    const shouldShowArtistDashboard = user.hasOwnProperty('artist')
    return(     
      isValidUser
        ? shouldShowArtistDashboard
          ? <ArtistDashboard />
          : <BuyerDashboard />
        : <div>Please login again</div>
    )
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.object,
  addArt: PropTypes.func,
  art: PropTypes.array,
  token: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    art: state.art.artPieces,
    token: state.session.token
  }
}

const mapDispatchToProps = {
  addArt
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
