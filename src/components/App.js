import React, { Component } from 'react'
import Navigation from './Navigation'
import ArtPage from './Artpage/ArtPage'
import Dashboard from './Dashboard'
import ArtDetail from './Artpage/ArtDetail'
import ArtistPage from './Artist/'
import Homepage from './Home'
import Signup from './profile/Signup'
import Login from './profile/Login'
import BidPage from './Bidding'
import noRouteFound from './ui/404'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import mobile from 'is-mobile'
import classnames from 'classnames'
import StripePage from './StripePage'

class App extends Component {
  state = {
    windowWidth: ''
  }
  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  updateDimensions = () => {
    const windowWidth  = window.innerWidth
    this.setState({ windowWidth })
  }
  render () {
    const isMobile = this.state.windowWidth < 716
    const appContainerClasses = classnames('homepage-container', {
      'homepage-container--mobile': isMobile
    })
    return (
      <BrowserRouter>
        <div className={appContainerClasses}>
          {!isMobile && <div className='homepage-sidebar'>
            <Navigation />
          </div>}
          <div className='homepage-content'>
            {isMobile && <div className='homepage-menu'>
              <Navigation isMobile/>
            </div>}
            <div className='homepage-content_main'>
              <Switch>
                <Route exact path='/' component={Homepage} />
                <Route exact path='/profile' component={Dashboard} />
                <Route exact path='/art' component={ArtPage} />
                <Route exact path='/art/:id' component={ArtDetail} />
                <Route exact path='/bid/:id' component={BidPage} />
                <Route exact path='/artist/:username' component={ArtistPage} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/stripeconnect' component={StripePage} />
                <Route path='*' exact={true} component={noRouteFound} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
