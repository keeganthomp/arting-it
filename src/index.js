import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

const { store, persistor } = configureStore()

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <App />
      </JssProvider>
    </PersistGate>
  </Provider>, document.getElementById('root'))
registerServiceWorker()
