import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import socketMiddleware from './socket'

export default function configureStore(initialState = {todos: []}) {
  return createStore(reducer, initialState,
      applyMiddleware(thunk, socketMiddleware)
  )
}
