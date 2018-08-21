import React, { Component } from 'react'
import Navigation from './Navigation'
import Profile from './Profile'
import ArtGrid from './ArtGrid'
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='homepage-conatiner'>
        <Navigation />
        <h1 className='homepage-header'>Nashville Local Art</h1>
        <ArtGrid/>
        <Route exact path="/profile" component={Profile} />
        </div>
      </Router>
    )
  }
}

export default App
