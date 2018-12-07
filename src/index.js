import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/store'


ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>, document.getElementById('root'))
registerServiceWorker()
