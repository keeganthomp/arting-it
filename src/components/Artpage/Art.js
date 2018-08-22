import React from 'react'

export const Art = (props) => {
  return(
    <div className='art-wrapper'>
      <img className='artgrid-art' src={props.image} alt='' />
      <p>{props.price}</p>
    </div>
  )
}

export default Art