import React, { Component } from 'react'

class Profile extends Component {
  constructor(props){
    super()
    this.state = {
      artist: props.location.state || null
    }
  }
  componentDidMount() {
    const { artist } = this.state
    !artist && this.props.history.push({
      pathname: '/login',
      state: 'Please login or create an account to view profile.'
    })
  }
  render () {
    return(
      <div>
        THIS IS THE PROFiLE PAGEE
      </div>
    )
  }
}

export default Profile