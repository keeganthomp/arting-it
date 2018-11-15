import React, { Component } from 'react'
import Navigation from './Navigation'
import ArtPage from './Artpage/ArtPage'
import Profile from './Profile'
import ArtDetail from './Artpage/ArtDetail'
import Homepage from './Home'
import Signup from './profile/Signup'
import Login from './profile/Login'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className='homepage-conatiner'>
          <Navigation />
          <h1 className='homepage-header'>Nashville Local Art Title</h1>
          <Switch>
            <Route exact path='/' component={Homepage} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/art' component={ArtPage} />
            <Route exact path='/art/:id' component={ArtDetail} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
