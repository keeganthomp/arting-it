import React, { Component } from 'react'
import { Formik } from 'formik'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import * as Yup from 'yup'
import { createArtist, createBuyer } from 'api'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import MuiPhoneNumber from 'material-ui-phone-number'

class Signup extends Component {
  state = {
    phoneNumber: '',
    phoneNumberError: false
  }
  createUser = data => {
    // user will either be an artist or a buyer
    const isUserAnArtist = data.accountType.toLowerCase() === 'artist'
    const formattedData = {
      ...data,
      phone: data.phone.replace(/[- )(]/g,'')
    }
    // if the new user is not an artist, then they are a buyer
    if (isUserAnArtist) {
      createArtist(formattedData).then(res => res.status === 200 && this.props.history.push('/login'))
    } else {
      createBuyer(formattedData).then(res => res.status === 200 && this.props.history.push('/login'))
    }
  }
  checkForPhoneNumberError = (phoneNumberFromInput) => {
    const { phoneNumber } = this.state
    const phoneNumberToValidate = phoneNumberFromInput || phoneNumber
    const validPhoneNumberRegex = /^\+?[0-9]{1}\s*(\([0-9]{3}\)\s*|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
    const isValidPhoneNumber = validPhoneNumberRegex.test(phoneNumberToValidate)
    if (isValidPhoneNumber) {
      this.setState({ phoneNumberError: false })
    } else {
      this.setState({ phoneNumberError: 'Please enter a valid phone number' })
    }
  }
  hanndlePhoneNumberChange  = (phoneNumber) => {
    this.setState({ phoneNumber })
    if (this.state.phoneNumberError) {
      this.checkForPhoneNumberError(phoneNumber)
    }
  }

  render () {
    return (<div className='signup-container container'>
      <h1 className='signup-header'>Signup page</h1>
      <Formik
        validationSchema={
          Yup.object().shape({
            username: Yup.string().min(5).required('Username is required'),
            password: Yup.string().min(5).required('Password is required'),
            accountType: Yup.string().required('Account Type is required')
          })
        }
        validateOnBlur={false}
        onSubmit={(values) => {
          const valuesForDatabase = {
            ...values,
            phone: this.state.phoneNumber
          }
          this.createUser(valuesForDatabase)
        }}
        render={({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          <form className='signup-form' onSubmit={handleSubmit}>
            <div className='signup-input-container'>
              <FormControl required style={{width: 175}}>
                <InputLabel error={!!errors.accountType} shrink htmlFor='account-type-input_account-type'>
                  Account Type
                </InputLabel>
                <Select
                  value={values.accountType}
                  onChange={handleChange}
                  name='accountType'
                  error={!!errors.accountType}
                  inputProps={{
                    id: 'account-type-input_account-type'
                  }}
                >
                  <MenuItem value='artist'>Artist</MenuItem>
                  <MenuItem value='buyer'>Buyer</MenuItem>
                </Select>
              </FormControl>
              {errors.accountType && <div className='signup-form_error'>{errors.accountType}</div>}
            </div>
            <div className='signup-input-container'>
              <TextField
                required
                error={errors.username && true}
                label='Username'
                type='text'
                name='username'
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {errors.username && <div className='signup-form_error'>{errors.username}</div>}
            </div>
            <div className='signup-input-container'>
              <TextField
                required
                error={errors.password && true}
                label='Password'
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {errors.password && <div className='signup-form_error'>{errors.password}</div>}
            </div>
            <div className='signup-input-container'>
              <MuiPhoneNumber
                required
                onBlur={() => this.checkForPhoneNumberError()}
                name='phone'
                error={this.state.phoneNumberError}
                label='Phone Number'
                data-cy='user-phone'
                defaultCountry={'us'}
                value={this.state.phoneNumber}
                onChange={phoneNumber => this.hanndlePhoneNumberChange(phoneNumber)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {this.state.phoneNumberError && <div className='signup-form_error'>{this.state.phoneNumberError}</div>}
            </div>
            <div className='signup-input-container' style={{ marginTop: '1rem' }}>
              <Button type='submit' variant='contained' color='primary' >signup</Button>
            </div>
          </form>
        )}
      />
    </div>
    )
  }
}

Signup.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object
}

export default Signup
