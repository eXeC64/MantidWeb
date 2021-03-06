
export const defaultState = {
  status: 'disconnected',
  workspaces: {},
  algorithms: {},
  usable_algorithms: [],
  graphs: {},
  files: {
    status: "refreshing",
    list: []
  },
  curves: {}
}

export function reducer(state, action) {

  switch(action.type) {

    case 'RESET_MANTIDWEB':
      return defaultState;

    case 'MANTID_CONNECTION':
      if(action.status === "disconnected")
        return defaultState;

      return {
        ...state,
        status: action.status
      }

    case 'USABLE_ALGORITHMS':
      return {
        ...state,
        usable_algorithms: action.data
      }

    case 'ALGORITHM_LIST':
      return {
        ...state,
        algorithms: action.data
      }

    case 'WORKSPACE_LIST':
      return {
        ...state,
        workspaces: action.data
      }

    case 'ALGORITHM_DETAILS':
      return {
        ...state,
        algorithms: {
          ...state.algorithms,
          [action.data.id]: action.data
        }
      }

    case 'ALGORITHM_DELETED':
      let deleted_algs = {...state.algorithms}
      delete deleted_algs[action.id];
      return {
        ...state,
        algorithms: deleted_algs
      }

    case "ALGORITHM_STATE":
      var alg_details = {
        ...state.algorithms[action.algorithm],
        state: action.state,
        progress: action.progress,
        message: action.message,
        error: action.error
      };

      return {
        ...state,
        algorithms: {
          ...state.algorithms,
          [action.algorithm]: alg_details
        }
      }

    case 'PROPERTY_UPDATED':
      var prop_idx = -1;
      for(var i = 0; i < state.algorithms[action.algorithm].properties.length; i++) {
        if(state.algorithms[action.algorithm].properties[i].name == action.property) {
          prop_idx = i;
          break;
        }
      }
      if(prop_idx < 0) {
        return state;
      }

      var new_props = [...state.algorithms[action.algorithm].properties];
      new_props[prop_idx] = {
        ...state.algorithms[action.algorithm].properties[prop_idx],
        ...action.data
      }

      return {
        ...state,
        algorithms: {
          ...state.algorithms,
          [action.algorithm]: {
            ...state.algorithms[action.algorithm],
            properties: new_props
          }
        }
      }

    case 'REFRESH_FILES':
      return {
        ...state,
        files: {
          status: "refreshing",
          list: []
        }
      }

    case 'DIRECTORY_CONTENTS':
      return {
        ...state,
        files: {
          status: "ready",
          list: action.data
        }
      }

    case 'GRAPH_LIST':
      return {
        ...state,
        graphs: action.data
      }

    case 'GRAPH_DETAILS':
      return {
        ...state,
        graphs: {
          ...state.graphs,
          [action.id]: action.data
        }
      }

    case 'GRAPH_DELETED':
      let deleted_graphs = {...state.graphs}
      delete deleted_graphs[action.id];
      return {
        ...state,
        graphs: deleted_graphs
      }

    case 'CURVE_LIST':
      //TODO - be smarter
      return {
        ...state,
        curves: action.data
      }

    default:
      return state
  }
}
