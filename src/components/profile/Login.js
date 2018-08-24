import React, { Component } from 'react'
import { Formik } from 'formik'
import TextField from '@material-ui/core/TextField'
import { login } from '../../api'

class Login extends Component {
  constructor(props){
    super()
  }
  login = data => {
    login(data)
  }
  render() {
    return(<div className='Login-container container'>
      <h1>Login page</h1>
        <Formik
          onSubmit={(values) => this.login(values)}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
          }) => (
            <form className='Login-form row' onSubmit={handleSubmit}>
              <div className='col-12'>
                <TextField
                  label='Username'
                  type='text'
                  name='username'
                  value={values.username}
                  onChange={handleChange}
                />
              </div>
              <div className='col-12'>
                <TextField
                  label='Password'
                  type='password'
                  name='password'
                  value={values.password}
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

export default Login