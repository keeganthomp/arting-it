import React, { Component } from 'react'
import { Formik } from 'formik'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import { createArtist } from '../api'

class Signup extends Component {
  constructor(props){
    super()
  }
  createArtist = data => {
    console.log('DATAAAA IN CRATE ARTIST FUNC::', data)
    createArtist(data)
  }
  render() {
    return(<div className='signup-container container'>
      <h1>Signup page</h1>
        <Formik
          initialValues={{
            // firstName: 'jow',
            // lastName: 'woo',
            // sex: 'F',
            // age: 40,
            // location: 'Nashville',
            // specialty: 'watercolor'
          }}
          onSubmit={(values) => createArtist(values)}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form className='signup-form row' onSubmit={handleSubmit}>
              <div className='col-12'>
                <TextField
                  label='First Name'
                  type='text'
                  name='first_name'
                  value={values.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className='col-12'>
                <TextField
                  label='Last Name'
                  type='text'
                  name='last_name'
                  value={values.lastName}
                  onChange={handleChange}                
                />
              </div>
              <div className='col-12'>
                <FormControl>
                  <InputLabel shrink htmlFor="sex-input-signup">
                    Sex
                  </InputLabel>
                  <Select
                    value={values.sex}
                    onChange={handleChange}
                    input={<Input name="sex" id="sex-input-signup" />}
                  >
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="M">Male</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className='col-12'>
                <FormControl>
                  <InputLabel shrink htmlFor="age-input-signup">
                    Age
                  </InputLabel>
                  <Select
                    value={values.age}
                    onChange={handleChange}
                    input={<Input name="age" id="age-input-signup" />}
                  >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className='col-12'>
                <FormControl>
                  <InputLabel shrink htmlFor="location-input-signup">
                    Location
                  </InputLabel>
                  <Select
                    value={values.location}
                    onChange={handleChange}
                    input={<Input name="location" id="location-input-signup" />}
                  >
                    <MenuItem value='Nashville'>Nashville</MenuItem>
                    <MenuItem value='Smyrna'>Smyrna</MenuItem>
                    <MenuItem value='Brentwood'>Brentwood</MenuItem>
                    <MenuItem value='Franklin'>Franklin</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className='col-12'>
                <TextField
                  label='Specialty'
                  type='text'
                  name='specialty'
                  value={values.specialty}
                  onChange={handleChange}                
                />
              </div>
              <div className='col-12'>              
                <button type='submit'>SUBMIT</button>
              </div>
            </form>
          )}
        />
    </div>
    )
  }
}

export default Signup