import React, {Component} from 'react'
import ArtGrid from './ArtGrid'
import ArtPageFilters from './ArtPageFilters'
import ArtDetail from './ArtDetail'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import {checkForValidUser} from '../../helpers/auth'
import Accordian from '../ui/Accordian'
import { connect } from 'react-redux'
import { getAllArt } from 'api'

class ArtPage extends Component {
  constructor(props) {
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

  fetchArt = () => {
    getAllArt().then(axiosResult => {
      const art = axiosResult.data && axiosResult.data.art
      if (art.length > 0) {
        const artTypes = art.map(art => art.type)
        const filtersAvailable = artTypes.filter((item, index) => artTypes.indexOf(item) >= index)
        this.setState({ art, filtersAvailable })
      }
      this.setState({isFetchingArt: false})
    }).catch(() => {
      this.setState({isFetchingArt: false})
    })
  }

  callBackForInValidUser = () => {
    this
      .props
      .history
      .push('login')
  }

  componentDidMount() {
    const { token } = this.props
    // this.setState({isFetchingArt: true})
    checkForValidUser({
      callbackOnSuccess: this.fetchArt,
      callbackOnFailure: this.callBackForInValidUser,
      token
    })
  }
  shouldShowDetailedView = (detailedViewArt) => {
    this.setState({detailedViewArt})
  }
  updatesSelectedFilters = (filterToAdd) => {
    const {selectedFilters} = this.state
    const isAlreadySelected = selectedFilters.includes(filterToAdd)
    if (!isAlreadySelected) {
      this.setState({
        selectedFilters: [
          ...selectedFilters,
          filterToAdd
        ]
      })
    } else {
      const filterToDeselect = selectedFilters.filter(filter => filterToAdd !== filter)
      this.setState({selectedFilters: filterToDeselect})
    }
  }
  render() {
    const {art, isFetchingArt, filtersAvailable, selectedFilters} = this.state
    const { token } = this.props
    return !!token && !isFetchingArt 
      ? (
        <div className='artpage-container'>
          {this.state.detailedViewArt && <ArtDetail
            shouldShowDetailedView={this.shouldShowDetailedView}
            image={this.state.detailedViewArt}/>}
          {!this.state.detailedViewArt && <div>
            <div className='artpage_filter-wrapper'>
              <Accordian>
                <ArtPageFilters
                  filters={filtersAvailable}
                  isFetchingArt={isFetchingArt}
                  updatesSelectedFilters={this.updatesSelectedFilters}
                  selectedFilters={selectedFilters}/>
              </Accordian>
            </div>
            <div className='artpage_art-container'>
              <ArtGrid
                push={this.props.history.push}
                shouldShowDetailedView={this.shouldShowDetailedView}
                art={art}
                isFetchingArt={isFetchingArt}
                selectedFilters={selectedFilters}/>
            </div>
          </div>}
        </div>
      ) 
      : <CircularProgress/>
  }
}

ArtPage.propTypes = {
  history: PropTypes.object,
  artist: PropTypes.object,
  token: PropTypes.object
}
const mapStateToProps = (state) => {
  return {
    artist: state.user,
    token: state.session.token
  }
}

export default connect(mapStateToProps)(ArtPage)
