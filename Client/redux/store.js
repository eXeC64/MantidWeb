import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import socketMiddleware from './socket'

const defaultState = {
  status: 'disconnected',
  workspaces: {},
  algorithms: {},
  usable_algorithms: [],
  graphs: {},
  files: {
    status: "refreshing",
    list: []
  }
}

export default function configureStore(initialState = defaultState) {
  return createStore(reducer, initialState,
      applyMiddleware(thunk, socketMiddleware)
  )
}
