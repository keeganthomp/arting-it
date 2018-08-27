import React, { Component } from 'react'
import FileUploader from './ui/fileUploader'
import { updateArtist } from '../api'

class Profile extends Component {
  constructor(props){
    super()
    this.state = {
      artist: props.location.state || null,
      art: []
    }
  }
  componentDidMount() {
    const { artist } = this.state
    console.log('ARTISTT:', artist)
    !artist && this.props.history.push({
      pathname: '/login',
      state: 'Please login or create an account to view profile.'
    })
  }
  onDrop = (file) => {
    const art = [...this.state.art, file[0]]
    this.setState({ art })
  }
  saveAvatar = (file) => {
    const { artist } = this.state
    this.setState({ file: file })
    const reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = () => {
      const avatar = reader.result.replace(/^data:image\/png;base64,/, '')
      
      updateArtist({ avatar }, artist.id)
    }
  }
  
  render () {
    const { artist } = this.state
    return(
     artist && <div>
        <h3>Hi {artist.username || (artist.first_name + artist.last_name)}!</h3>
        <FileUploader noPreview className='profile_avatar' onDrop={this.saveAvatar}>
          <div>
            {artist.avatar && <img src={`data:image/png;base64,${artist.avatar}`}/> ||
            <i className='fas fa-user-alt profile_avatar-icon' />}
          </div>
        </FileUploader>
        <div>
          Would you like to add more art to be sold?
        </div>
        <FileUploader onDrop={this.onDrop}/>
        <div>
          <p>Below are your current pieces for sale:</p>
          <div>
            ---insert art from db---
          </div>
        </div>
      </div>
    )
  }
}

export default Profile