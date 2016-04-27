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
          ws.send(JSON.stringify({type: "GET_CURVE_LIST"}));
        }
        break;
      case "WORKSPACE_LIST":
      case "USABLE_ALGORITHMS":
      case "ALGORITHM_LIST":
      case "ALGORITHM_DETAILS":
      case "ALGORITHM_DELETED":
      case "PROPERTY_UPDATED":
      case "ALGORITHM_STATE":
      case "DIRECTORY_CONTENTS":
      case "CURVE_LIST":
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
      case 'DELETE_WORKSPACE':
      case 'RENAME_WORKSPACE':
      case 'LOAD_WORKSPACE':
      case 'SAVE_WORKSPACE':
      case 'SET_PROPERTY':
      case 'RUN_ALGORITHM':
        socket.send(JSON.stringify(action));
        break;

      case 'REFRESH_FILES':
        //Tell the server, then dispatch to store
        socket.send(JSON.stringify({type: "GET_DIRECTORY_CONTENTS"}));
        return next(action);

      default:
        return next(action);
    }
  }

})();

export default socketMiddleware
