import React from 'react'
import { render } from 'react-dom'
import App from '../components/App'
import configureStore from '../redux/store'
import { Provider } from 'react-redux'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();


let initialState = {
  status: 'disconnected',
  selectedInterface: 'algorithms',
  workspaces: {},
  algorithms: {},
  usable_algorithms: [],
  graphs: {}
}

let store = configureStore(initialState)

render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
)
