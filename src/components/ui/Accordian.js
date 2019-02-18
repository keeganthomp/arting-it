import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class Accordian extends Component {
  constructor () {
    super ()
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
  }

  

  render () {
    const accordianContentClasses = classnames('accordian-content', {
      'accordian-content--open': this.state.isOpen
    })
    const accordianArrowClasses = classnames('accordian-arrow-icon', {
      'accordian-arrow-icon--open': this.state.isOpen
    })
    return(
      <div className='accordian-wrapper'>
        <div onClick={() => this.setState({ isOpen: !this.state.isOpen })} className='accordian-header-wrapper'>
          <i className={`${accordianArrowClasses} fa fa-angle-down`} />
        </div>
        <div className={accordianContentClasses}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

Accordian.propTypes = {
  children: PropTypes.object
}

export default Accordian