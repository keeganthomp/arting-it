import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../api'


export default class Navigation extends Component {
  render() {
    return (
      <div className='navigation-container'>
        <Link to='/'>
          <button>Home</button>
        </Link>
        <Link to='/art'>
          <button>Art</button>
        </Link>
        <Link to='/profile'>
          <button>Profile</button>
        </Link>
        <Link to='/signup'>
          <button>Signup</button>
        </Link>
        <Link to='/login'>
          <button>Login</button>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }
}
