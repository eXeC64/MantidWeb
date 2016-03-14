
export default function reducer(state, action) {
  switch(action.type) {
    case 'MANTID_CONNECTION':
      return Object.assign({}, state, {status: action.status} )
    case 'SELECT_INTERFACE':
      return Object.assign({}, state, {selectedInterface: action.interface})
    case 'USABLE_ALGORITHMS':
      return Object.assign({}, state, {usable_algorithms: action.data})
    case 'ALGORITHM_LIST':
      return Object.assign({}, state, {algorithms: action.data})
    case 'WORKSPACE_LIST':
      return Object.assign({}, state, {workspaces: action.data})
    case 'ALGORITHM_DETAILS':
      const algs = Object.assign({}, state.algorithms, {[action.data.id]: action.data})
      return Object.assign({}, state, {algorithms: algs})
    case 'WORKSPACE_DETAILS':
      const wsps = Object.assign({}, state.workspaces, {[action.data.name]: action.data})
      return Object.assign({}, state, {workspaces: wsps})
    case 'ALGORITHM_DELETED':
      const deleted_algs = Object.assign({}, state.algorithms);
      delete deleted_algs[action.id];
      return Object.assign({}, state, {algorithms: deleted_algs})
    case 'WORKSPACE_DELETED':
      const deleted_wsps = Object.assign({}, state.workspaces);
      delete deleted_wsps[action.name];
      return Object.assign({}, state, {workspaces: deleted_wsps})
    case 'WORKSPACE_RENAMED':
      const renamed_wsps = Object.assign({}, state.workspaces);
      renamed_wsps[action.newName] = renamed_wsps[action.oldName]
      delete renamed_wsps[action.oldName];
      return Object.assign({}, state, {workspaces: renamed_wsps})
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

    default:
      return state
  }
}
