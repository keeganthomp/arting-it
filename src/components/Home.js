import React, { Component } from 'react'
import FlipCard from './ui/FlipCard'
import axios from 'axios'
import PropTypes from 'prop-types'
const queryString = require('query-string')
import { createStripeConnectAccount } from 'api'


class Homepage extends Component {
  state = {
    art: []
  }
  fetchArt = () => {
    axios({
      method: 'GET',
      url: `http://${process.env.NODE_ENV === 'production' ? 'tealeel-api.com' : 'localhost:80'}/api/art`
    }).then(axiosResult => {
      const art = axiosResult.data && axiosResult.data.art
      if (art.length > 0) {
        this.setState({ 
          art
        })
      }
      this.setState({ isFetchingArt: false })
    }).catch(err => {
      this.setState({ isFetchingArt: false })
      console.log('Error fetching art:', err)
    })
  }
  componentDidMount() {
    console.log('WEEEEEEEEEEEEEE', process.env.NODE_ENV)
    const { search } = this.props.location
    const parsedQueryParams = queryString.parse(search)
    const stripeClientId = parsedQueryParams && parsedQueryParams.code
    createStripeConnectAccount({
      clientId: stripeClientId,
      artistId: ''
    })
    this.fetchArt()
  }
  render () {
    return(
      <div className='homepage-wrapper'>
        <h1 className='homepage-header'>teal eelwee</h1>
        <div className='homepage-content-container'>
          {this.state.art.length > 0 && this.state.art.map(artPiece => <FlipCard
            key={artPiece.id}
            imageClass='homepage-content_image'
            artPiece={artPiece}
            push={this.props.history.push} />
          )}
        </div>
      </div>
    )
  }
}

Homepage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Homepage