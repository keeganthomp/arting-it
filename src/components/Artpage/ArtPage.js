import axios from 'axios'
import React, { Component } from 'react'
import ArtGrid from './ArtGrid'
import ArtpageLeftColumn from './ArtpageLeftColumn'
import ArtDetail from './ArtDetail'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

class ArtPage extends Component {
  constructor() {
    super()
    this.state = {
      detailedViewArt: '',
      shouldShowDetailedView: false,
      isFetchingArt: false,
      filtersAvailable: [],
      selectedFilters: [],
      art: []
    }
  }
  componentDidMount() {
    this.setState({ isFetchingArt: true })
    axios({
      method: 'GET',
      url: `http://${process.env.NODE_ENV === 'production' ? '142.93.241.62' : 'localhost'}:8080/api/art`
    }).then(axiosResult => {
      const art = axiosResult.data.art
      const parsedArt = art.map(artPiece => JSON.parse(artPiece))
      const artTypes = parsedArt.map(art => art.type)
      const filtersAvailable = artTypes.filter((item, index) => artTypes.indexOf(item) >= index)
      this.setState({ 
        art: parsedArt,
        filtersAvailable,
        isFetchingArt: false
      })
    }).catch(err => {
      this.setState({ isFetchingArt: false })
      throw new err
    })
  }
  shouldShowDetailedView = (detailedViewArt) => {
    this.setState({ detailedViewArt })
  }
  updatesSelectedFilters = (filterToAdd) => {
    const { selectedFilters } = this.state
    const isAlreadySelected = selectedFilters.includes(filterToAdd)
    if (!isAlreadySelected) {
      this.setState({ selectedFilters: [...selectedFilters, filterToAdd] })
    } else {
      const filterToDeselect = selectedFilters.filter(filter => filterToAdd !== filter)
      this.setState({ selectedFilters: filterToDeselect })
    }
  }
  render () {
    const { art, isFetchingArt, filtersAvailable, selectedFilters } = this.state
    return !isFetchingArt && (
      <div className='artpage-container container'>
        {this.state.detailedViewArt && <ArtDetail shouldShowDetailedView={this.shouldShowDetailedView} image={this.state.detailedViewArt} />}
        {!this.state.detailedViewArt && <div className='row no-gutters'>
          <div className='col-sm-12 col-lg-4'>
            <ArtpageLeftColumn
              filters={filtersAvailable}
              isFetchingArt={isFetchingArt}
              updatesSelectedFilters={this.updatesSelectedFilters}
              selectedFilters={selectedFilters}
            />
          </div>
          <div className='col-sm-12 col-lg-8'>
            <ArtGrid 
              push={this.props.history.push}
              shouldShowDetailedView={this.shouldShowDetailedView}
              art={art} 
              isFetchingArt={isFetchingArt}
              selectedFilters={selectedFilters}
            />
          </div>
        </div>}
      </div>
    ) || <CircularProgress />
  }
}

ArtPage.propTypes = {
  history: PropTypes.object
}

export default ArtPage