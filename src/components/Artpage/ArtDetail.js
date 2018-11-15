import React from 'react'
import PropTypes from 'prop-types'

export const ArtDetail = (props) => {
  return(
    <div className='art-detail-container'>
      <div>
        <img src={props.image || 'https://picsum.photos/200/300/?random' } alt='' />
      </div>
      <div>
        <p>som info about the thing</p>
        <p>som info about the artist maybe</p>
        <p>----artist image-----</p>
        <button>make offer</button>
      </div>
      <div>      
        <button onClick={() => props.history.push('/art')}>go back</button>
      </div>
    </div>
  )
}

ArtDetail.propTypes = {
  image: PropTypes.string,
  history: PropTypes.object
}

export default ArtDetail