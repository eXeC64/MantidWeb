import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {reducer, defaultState} from './reducer'
import socketMiddleware from './socket'

export default function configureStore(initialState = defaultState) {
  return createStore(reducer, initialState,
      applyMiddleware(thunk, socketMiddleware)
  )
}
