import React, { Component } from 'react'
import FlipCard from './ui/FlipCard'
import PropTypes from 'prop-types'
// const queryString = require('query-string')
import { connect } from 'react-redux'
import { getAllArt } from 'api'

class Homepage extends Component {
  state = {
    art: []
  }
  fetchArt = () => {
    getAllArt().then(axiosResult => {
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
    this.fetchArt()
  }
  render () {
    return(
      <div className='homepage-wrapper'>
        <h1 className='homepage-header'>teal eelwee</h1>
        <div className='homepage-content-container'>
          {this.state.art.length > 0 && this.state.art.map((artPiece, index) => 
            <FlipCard
              key={(artPiece.id || artPiece.Id) + index.toString()}
              imageClass='homepage-content_image'
              artPiece={artPiece}
              push={this.props.history.push} />)}
        </div>
      </div>
    )
  }
}

Homepage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  artist: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    artist: state.user.artist
  }
}

export default connect(mapStateToProps)(Homepage)