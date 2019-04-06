import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../api'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Navigation extends Component {
  constructor () {
    super ()
    this.state = {
      mobileNavIsOpen: false
    }
  }

  renderMenuIcon = () => {
    const menuIconClasses = classnames('navigation-menu-icon', {
      'navigation-menu-icon-animate': this.state.mobileNavIsOpen
    })
    return(
      <div className='navigation-menu-icon-continer'>
        <div 
          className={menuIconClasses}
          onClick={() => this.setState({ mobileNavIsOpen: !this.state.mobileNavIsOpen })}>
          <div className='navigation-menu-icon-barOne'></div>
          <div className='navigation-menu-icon-barTwo'></div>
          <div className='navigation-menu-icon-barThree'></div>
        </div>
      </div>
    )
  }
  render() {
    console.log('NAV_PROPSS:', this.props)
    const linkContainerClasses = classnames('navigation-link-container', {
      'navigation-link-container--open': this.state.mobileNavIsOpen
    })
    return (
      <div className='navigation-container'>
        <div 
          onClick={() => this.setState({ mobileNavIsOpen: !this.state.mobileNavIsOpen })}
          className={linkContainerClasses}>
          <Link to='/'>
            <button className='navigation-link'>home</button>
          </Link>
          <Link to='/art'>
            <button className='navigation-link'>art</button>
          </Link>
          <Link to='/profile'>
            <button className='navigation-link'>profile</button>
          </Link>
          {!this.props.token && <Link to='/signup'>
            <button className='navigation-link'>signup</button>
          </Link>}
          {!this.props.token && <Link to='/login'>
            <button className='navigation-link'>login</button>
          </Link>}
          {this.props.token && <button className='navigation-link' onClick={logout}>logout</button>}
        </div>
        {this.renderMenuIcon()}
      </div>
    )
  }
}

Navigation.propTypes = {
  token: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps, null)(Navigation)

