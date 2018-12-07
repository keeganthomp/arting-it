import React, { Component } from 'react'
import { Formik } from 'formik'
import TextField from '@material-ui/core/TextField'
import { login } from '../../api'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUser } from '../../actions/userActions'

class Login extends Component {
  constructor(){
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
    this.props.getUser({ payload: userData })
    sessionStorage.setItem('user', JSON.stringify(userData))
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
          handleChange,
          handleSubmit
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

Login.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

const mapDispatchToProps = {
  getUser
}

export default connect(null, mapDispatchToProps)(Login)
