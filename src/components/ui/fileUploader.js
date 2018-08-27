import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import CircularProgress from '@material-ui/core/CircularProgress'

class FileUploader extends Component {
  constructor(props) {
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
    const { className, noPreview, children } = this.props
    return(
        <div className='file-uploader_container'>
          <Dropzone onDrop={this.onDrop} onDropAccepted={this.onDropAccepted} className={`${className ? className : 'file-uploader'}`}>
            {children || <h1 style={{ padding: '2.25rem', fontSize: '4rem' }}>+</h1>}
          </Dropzone>
            {files.length > 0 && !noPreview && <div className='file-uploader_summary'>
              <p>Recently uploaded:</p>
              <div>
                {files.map((file, index) => !loading && 
                  <div key={index}>
                  {console.log('FILELELELEL:', file)}
                  <li>{file.name} - {file.size} bytes</li>
                      <img className='file-uploader_image-preview' src={URL.createObjectURL(file)} alt='' />
                  </div> || <CircularProgress key={index}/>)}
              </div>
            </div>}
        </div>
    )
  }
}

export default FileUploader