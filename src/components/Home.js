import React from 'react'
import FlipCard from './ui/FlipCard'

export const Homepage = () => {
  return(
    <div>
      <h1 className='homepage-header'>Teal Eel</h1>
      <div className='homepage-content-container'>
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        <FlipCard imageClass='homepage-content_image' imageSource='assets/pup.jpeg' />
        
      </div>
    </div>
  )
}

export default Homepage