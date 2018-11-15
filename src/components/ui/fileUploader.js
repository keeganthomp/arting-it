import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

class FileUploader extends Component {
  constructor() {
    super()
    this.state = {
      files: [],
      loading: false
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
    const { files, loading } = this.state
    const { className, noPreview, children, isLoadingImage } = this.props
    return(
        <div className='file-uploader_container'>
          <Dropzone onDrop={this.onDrop} onDropAccepted={this.onDropAccepted} className={`${className ? className : 'file-uploader'}`}>
            {children || <h1 style={{ padding: '2.25rem', fontSize: '4rem' }}>+</h1>}
          </Dropzone>
            {files.length > 0 && !noPreview && !loading && !isLoadingImage && <div className='file-uploader_summary'>
              <p>Recently uploaded:</p>
                <div>
                {files.map((file, index) =>  
                  <div key={index}>
                  <div>{file.name} - {file.size} bytes</div>
                      <img className='file-uploader_image-preview' src={URL.createObjectURL(file)} alt='' />
                </div>)}
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
  isLoadingImage: PropTypes.bool
}

export default FileUploader