import React, { Component } from 'react'
import { updateArt } from '../../api'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'

class Artpiece extends Component {
  constructor() {
    super()
    this.state = {
      artPiece: {},
      artDescription: '',
      artPrice: '',
      artPieceType: '',
      showNotification: false
    }
  }
  componentDidMount() {
    const { artPiece } = this.props
    if (typeof artPiece === 'string') {
      this.setState({
        artPiece: JSON.parse(artPiece),
        artPrice: JSON.parse(artPiece).price,
        artDescription: JSON.parse(artPiece).description,
        artPieceType: JSON.parse(artPiece).type
      })
    } else {
      this.setState({
        artPiece,
        artPrice: artPiece.price,
        artDescription: artPiece.description,
        artPieceType: artPiece.type
      })
    }
  }
  saveUpdatedUserToSession = (dataFromApi) => {
    sessionStorage.setItem('user', JSON.stringify(dataFromApi.artistWithUpdatedArt))
    this.setState({  showNotification: true })
  }
  updateArtPieceMeta = (e) => {
    e.preventDefault()
    const { allArt, artistId } = this.props
    const { artDescription, artPrice, artPiece, artPieceType } = this.state
    const parsedArt = allArt.map(art => JSON.parse(art))
    const artToUpdate = parsedArt.find(element => element.id === artPiece.id)
    const indexOfItemToUpdate = parsedArt.indexOf(artToUpdate)
    const updatedArtPiece = {
      ...artToUpdate,
      price: artPrice || artToUpdate.price,
      description: artDescription || artToUpdate.description,
      type: artPieceType || artToUpdate.type
    }
    parsedArt[indexOfItemToUpdate] = updatedArtPiece
    const artForDb = parsedArt.map(art => JSON.stringify(art))
    updateArt(artForDb, artistId, this.saveUpdatedUserToSession)
  }

  handleClose = (event, reason) => {
    if (reason !== 'clickaway') {
      this.setState({ showNotification: false })
    }
  }

  render() {
    const { artDescription, artPrice, artPiece, artPieceType } = this.state
    return(
      <div className='profile_available-art-image-container'>
        <img className='profile_available-art-image' src={artPiece.artImage} alt='' />
        <form className='profile_available-art-info-container' onSubmit={(e) => this.updateArtPieceMeta(e)}>
          <TextField
            label='Description'
            type='text'
            name='art-description'
            value={artDescription}
            onChange={e => this.setState({ artDescription: e.target.value })}
          />
          <TextField
            label='Price'
            type='text'
            name='art-price'
            value={artPrice}
            onChange={e => this.setState({ artPrice: e.target.value })}
          />
          <FormControl>
            <InputLabel shrink htmlFor='art-type'>
              Art Type
            </InputLabel>
            <Select
              value={artPieceType}
              onChange={e => this.setState({ artPieceType: e.target.value })}
              input={<Input name='art-type' />}
            >
              <MenuItem value='painting'>Painting</MenuItem>
              <MenuItem value='drawing'>Drawing</MenuItem>
              <MenuItem value='photography'>Photography</MenuItem>
            </Select>
          </FormControl>
          <Button size='small' type='submit' variant='outline1' color='primary' >Update</Button>
        </form>
        {/* showing snackbar when artpiece meta has been updated */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={this.state.showNotification}
          autoHideDuration={2000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">Art Piece Updated</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              Got It
            </Button>
          ]}
        />
      </div>
    )
  }
}

Artpiece.propTypes = {
  artPiece: PropTypes.object,
  allArt: PropTypes.array,
  artistId: PropTypes.number
}

export default Artpiece
