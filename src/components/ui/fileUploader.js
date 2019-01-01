import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class FileUploader extends Component {
  constructor() {
    super()
    this.state = {
      files: [],
      loading: false,
      isHoveringOnDropZone: false
    }

  }
  onDrop = (file) => {
    this.setState({ loading: true })    
    const files = [...this.state.files, file[0]]
    this.setState({ files })
    this.props.onDrop && this.props.onDrop(file)
  }
  onDropAccepted = () => {
    this.setState({ loading: false })
  }
  render() {
    const { files, loading, isHoveringOnDropZone } = this.state
    const { className, noPreview, children, isLoading } = this.props
    const uploaderOverlayClasses = classnames('file-uploader_default-overlay', {
      'file-uploader_default-overlay--active': isHoveringOnDropZone
    })
    return(
      <div className='file-uploader_container'>
        <Dropzone onDrop={this.onDrop} onDropAccepted={this.onDropAccepted} className={`${className ? className : 'file-uploader'}`}>
          {children || <div 
            onMouseEnter={() => this.setState({ isHoveringOnDropZone: true })}
            onMouseLeave={() => this.setState({ isHoveringOnDropZone: false })}
          >
            <div className={uploaderOverlayClasses}>
              click to upload
            </div>
            <h1 style={{ padding: '2.25rem', fontSize: '4rem' }}>+</h1>
          </div>}
        </Dropzone>
        {files.length > 0 && !noPreview && !loading && !isLoading && <div className='file-uploader_summary'>
          {!isLoading && <p>Recently uploaded:</p>}
          <div>
            {/* {files.map((file, index) =>  
              <div key={index}>
                <div>{isLoading ? 'uplodaing' : 'poop'}{file.name} - {file.size} bytes</div>
                <img className='file-uploader_image-preview' src={URL.createObjectURL(file)} alt='' />
              </div>)} */}
          </div>
        </div> || null}
      </div>
    )
  }
}

FileUploader.propTypes = {
  onDrop: PropTypes.func,
  className: PropTypes.string,
  noPreview: PropTypes.bool,
  children: PropTypes.object,
  isLoadingImage: PropTypes.bool,
  isLoading: PropTypes.bool
}

export default FileUploader