import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

export const ArtPageFilters = ({ filters, selectedFilters, isFetchingArt, updatesSelectedFilters }) => {
  return !isFetchingArt && (
    <div className='artpage_filter-wrapper'>
      {filters.map(filter => <div key={filter} className='filter-container'>
        <FormControlLabel
          control={< Checkbox checked = {
            selectedFilters.includes(filter)
          }
          onChange = {
            (e) => updatesSelectedFilters(e.target.value)
          }
          value = {
            filter
          }
          color = 'primary' />}
          label={filter}/>
      </div>)}
    </div>
  )
}

export default ArtPageFilters