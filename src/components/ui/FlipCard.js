import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCardFlip from 'react-card-flip'
import Button from '@material-ui/core/Button'

class FlipCard extends Component {
  constructor () {
    super ()
    this.state = {
      isFlipped: false,
      dimensions : {}
    }
  }

  componentDidMount() {
    const { imageClass } = this.props
    const img = document.getElementsByClassName(imageClass)[0]
    img && window.addEventListener('resize', this.getImageDimensions({ target: img }))
  }

  componentWillUnmount() {
    const { imageClass } = this.props
    const img = document.getElementsByClassName(imageClass)[0]
    window.removeEventListener('resize', this.getImageDimensions({ target: img }))
  }

  handleClick = (e) => {
    e.preventDefault()
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }))
  }

  getImageDimensions = ({ target: img }) => {
    this.setState({ 
      dimensions:{ 
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    })
  }


  render () {
    const { dimensions, isFlipped } = this.state
    const { imageClass, artPiece, push } = this.props
    return(
      <div style={{ ...dimensions }} className='flip-card-container'>
        <ReactCardFlip isFlipped={isFlipped}>
          <div style={{ ...dimensions }}  className='flip-card-front' onClick={this.handleClick} key='front'>
            <img
              className={imageClass}
              onLoad={this.getImageDimensions}
              src={artPiece.artImage} />
          </div>
          <div style={{ ...dimensions }} className='flip-card-back' onClick={this.handleClick} key='back'>
            <p>Created By: Tommy</p>
            <p>Adking: $6.66</p>
            <Button onClick={() => push(`/bid/${artPiece.id}`)} variant="contained" color="primary" >Make Offer</Button>
          </div>
        </ReactCardFlip>
      </div>
    )
  }
}

FlipCard.propTypes = {
  artInfo: PropTypes.object,
  imageClass: PropTypes.string,
  artPiece: PropTypes.object,
  push: PropTypes.func
}

export default FlipCard