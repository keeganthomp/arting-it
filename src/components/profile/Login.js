import React, { Component } from 'react'
import { Formik } from 'formik'
import TextField from '@material-ui/core/TextField'
import { login } from '../../api'

class Login extends Component {
  constructor(props){
    super()
    this.state = {
      apiError: '',
      noPermissionsMessage: ''
    }
  }
  componentDidMount () {
    this.props.location.state && this.setState({ noPermissionsMessage: this.props.location.state })
  }
  getUserData = (userData) => {
    this.props.history.push({
      pathname: '/profile',
      state: userData
    })
  }
  handleApiErrors = (apiError) => {
    this.setState({ apiError })
  }
  login = data => {
    login(data, this.getUserData, this.handleApiErrors)
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
            {this.state.noPermissionsMessage && <div className='col-12'>{this.state.noPermissionsMessage}</div>}
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
              {this.state.apiError && <div className='col-12' style={{ color: 'red' }} >Incorrect User Name or Password.</div>}
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