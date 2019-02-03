import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class FlipCard extends Component {
  constructor () {
    super ()
    this.state = {
      isFlipped: false
    }
  }
  render () {
    const { className, cardWidth, cardHeight, children } = this.props
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    const flipCardMobileClassNames = classnames('flip-card-mobile', {
      'flip-card-mobile--flipped' : isMobile && this.state.isFlipped
    })
    const flipCardInnerMobileClassNames = classnames('flip-card-inner-mobile', {
      'flip-card-inner-mobile--flipped' : isMobile && this.state.isFlipped
    })
    return(
      <div className={isMobile ? flipCardMobileClassNames : 'flip-card'} onClick={() => isMobile && this.setState({ isFlipped: !this.state.isFlipped })} style={{ width: cardWidth, height: cardHeight }}>
        <div className={isMobile ? flipCardInnerMobileClassNames : 'flip-card-inner'}>
          <div className={`flip-card-front ${className ? className : ''}`}>
            {children}
          </div>
          <div className='flip-card-back'>
            <div className='flip-card-back_content'>
              <p>Created by: someone</p> 
              <p>asking: $55</p> 
              <Button type='submit' variant='contained' color='primary' >Make Offer</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FlipCard.propTypes = {
  artInfo: PropTypes.object,
  className: PropTypes.string,
  cardWidth: PropTypes.string,
  cardHeight: PropTypes.string,
  children: PropTypes.object
}

export default FlipCard