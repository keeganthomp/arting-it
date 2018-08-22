import React from 'react'

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

export default ArtDetail