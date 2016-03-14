import actions from './actions'

const socketMiddleware = (function(){ 
  var socket = null;

  const onOpen = (ws,store,token) => evt => {
    ws.send(JSON.stringify({type: 'AUTH', token: token}))
    store.dispatch(actions.mantidConnected());
  }

  const onClose = (ws,store) => evt => {
    store.dispatch(actions.mantidDisconnected());
  }

  const onMessage = (ws,store) => evt => {
    var msg = JSON.parse(evt.data);
    switch(msg.type) {
      case "AUTH":
        console.log("Authentication result: " + msg.result);
        if(msg.result === "success") {
          ws.send(JSON.stringify({type: "GET_USABLE_ALGORITHMS"}));
          ws.send(JSON.stringify({type: "GET_ALGORITHM_LIST"}));
          ws.send(JSON.stringify({type: "GET_WORKSPACE_LIST"}));
        }
        break;
      case "USABLE_ALGORITHMS":
      case "ALGORITHM_LIST":
      case "WORKSPACE_LIST":
      case "ALGORITHM_DETAILS":
      case "WORKSPACE_DETAILS":
      case "ALGORITHM_DELETED":
      case "WORKSPACE_DELETED":
      case "PROPERTY_UPDATED":
        store.dispatch(msg);
        break;
      default:
        console.log("Received unknown message type: '" + msg.type + "'");
        break;
    }
  }

  return store => next => action => {
    switch(action.type) {
      case 'MANTID_CONNECT':
        if(socket != null) {
          socket.close();
        }
        socket = new WebSocket(action.url);
        socket.onmessage = onMessage(socket,store);
        socket.onclose = onClose(socket,store);
        socket.onopen = onOpen(socket,store,action.token);
        store.dispatch(actions.mantidConnecting());

        break;
      case 'MANTID_DISCONNECT':
        if(socket != null) {
          socket.close();
        }
        socket = null;
        store.dispatch(actions.mantidDisconnected());
        break;

      case 'CREATE_ALGORITHM':
      case 'DELETE_ALGORITHM':
      case 'SET_PROPERTY':
      case 'RUN_ALGORITHM':
        socket.send(JSON.stringify(action));
        break;

      default:
        return next(action);
    }
  }

})();

export default socketMiddleware
