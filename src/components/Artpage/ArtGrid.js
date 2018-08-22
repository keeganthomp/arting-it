import React, { Component}  from 'react'
// import { navigateToPa/ge } from '../../helpers/navigateToPage'

class ArtGrid extends Component {
  constructor (props) {
    super()
    console.log('THIS PROPS', props)
  }
  render () {
    return(
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

export default ArtGrid