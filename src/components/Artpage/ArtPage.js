import React, { Component } from 'react'
import ArtGrid from './ArtGrid'
import ArtpageLeftColumn from './ArtpageLeftColumn'
import ArtDetail from './ArtDetail'

class ArtPage extends Component {
    constructor(props) {
      super()
      this.state = {
        detailedViewArt: '',
        shouldShowDetailedView: false
      }
    }
  shouldShowDetailedView = (detailedViewArt) => {
    this.setState({ detailedViewArt })
  }
  render () {
    return(
      <div className='artpage-container container'>
        {this.state.detailedViewArt && <ArtDetail shouldShowDetailedView={this.shouldShowDetailedView} image={this.state.detailedViewArt} />}
        {!this.state.detailedViewArt && <div className='row no-gutters'>
          <div className='col-sm-12 col-lg-4'>
            <ArtpageLeftColumn />
          </div>
          <div className='col-sm-12 col-lg-8'>
            <ArtGrid push={this.props.history.push} shouldShowDetailedView={this.shouldShowDetailedView} />
          </div>
        </div>}
      </div>
    )
  }
}

export default ArtPage