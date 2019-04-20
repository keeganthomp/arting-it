import React, { Component, Fragment } from 'react'
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
    const navigationMenuIconClasses = classnames('navigation-menu-icon-container', {
      'navigation-menu-icon-container--open': this.state.mobileNavIsOpen
    })
    return(
      <div className={navigationMenuIconClasses}>
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
    const linkContainerClasses = classnames('navigation-link-container', {
      'navigation-link-container': this.state.mobileNavIsOpen
    })
    const navigationClasses = classnames('navigation-container', {
      'navigation-container--mobile': this.props.isMobile,
      'navigation-container--open': this.state.mobileNavIsOpen
    })
    return (<Fragment>
      <div className={navigationClasses}>
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
          {this.props.token && <a href='#'>
            <button className='navigation-link' onClick={logout}>logout</button>
          </a>}
        </div>
      </div>
      {this.props.isMobile && this.renderMenuIcon()}
    </Fragment>
    )
  }
}

Navigation.propTypes = {
  token: PropTypes.string,
  isMobile: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

export default connect(mapStateToProps, null)(Navigation)

