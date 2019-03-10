import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

class ArtGrid extends Component {
  render () {
    const { art, isFetchingArt, selectedFilters } = this.props
    return !isFetchingArt && (<Fragment>
      {art.map(artPiece => selectedFilters.includes(artPiece.type) && <div key={artPiece.artId} className='artgrid-container'>
        <div className='artgrid-art-wrapper'>
          <img
            onClick={() => this.props.push(`art/${artPiece.artId}`)}
            alt=''
            className='artgrid-art'
            src={artPiece.artImage} />
          <div className='artgrid-price-wrapper'>
            <p>{artPiece.price}</p>
          </div>
        </div>
      </div>)}
    </Fragment>
    )
  }
}

ArtGrid.propTypes = {
  shouldShowDetailedView: PropTypes.func,
  push: PropTypes.func,
  art: PropTypes.array,
  isFetchingArt: PropTypes.bool,
  selectedFilters: PropTypes.array
}

export default ArtGrid
