import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/store'
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> 
      <App />
    </PersistGate>
  </Provider>, document.getElementById('root'))
registerServiceWorker()
