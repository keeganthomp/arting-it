import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ArtGrid extends Component {
  render () {
    return (
      <div className='artgrid-container'>
        <div className='artgrid-art-wrapper'>
          <img onClick={() => this.props.push('/art/123')} alt='' className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
        <div className='artgrid-art-wrapper'>
          <img alt='' onClick={() => this.props.shouldShowDetailedView('https://picsum.photos/200/300/?random')} className='artgrid-art' src='https://picsum.photos/200/300/?random' />
          <div className='artgrid-price-wrapper'>
            <p>$45.99</p>
          </div>
        </div>
      </div>
    )
  }
}

ArtGrid.propTypes = {
  shouldShowDetailedView: PropTypes.func,
  push: PropTypes.func
}

export default ArtGrid
