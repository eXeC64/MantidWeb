let actions = {
  mantidConnect: function(url, token) {
    return {
      type: 'MANTID_CONNECT',
      url: url,
      token: token
    }
  },

  mantidDisconnect: function() {
    return {
      type: 'MANTID_DISCONNECT'
    }
  },

  mantidConnecting: function () {
    return {
      type: 'MANTID_CONNECTION',
      status: 'connecting'
    }
  },

  mantidConnected: function() {
    return {
      type: 'MANTID_CONNECTION',
      status: 'connected'
    }
  },

  mantidDisconnected: function() {
    return {
      type: 'MANTID_CONNECTION',
      status: 'disconnected'
    }
  },

  createAlgorithm: function(name, version) {
    return {
      type: 'CREATE_ALGORITHM',
      name: name,
      version: version
    }
  },

  deleteAlgorithm: function(id) {
    return {
      type: 'DELETE_ALGORITHM',
      id: id
    }
  },

  deleteWorkspace: function(name) {
    return {
      type: 'DELETE_WORKSPACE',
      workspace: name
    }
  },

  renameWorkspace: function(oldName, newName) {
    return {
      type: 'RENAME_WORKSPACE',
      oldName: oldName,
      newName: newName
    }
  },

  loadWorkspace: function(name, path) {
    return {
      type: "LOAD_WORKSPACE",
      workspace: name,
      path: path
    }
  },

  saveWorkspace: function(name, path) {
    return {
      type: "SAVE_WORKSPACE",
      workspace: name,
      path: path
    }
  },

  setProperty: function(alg, prop, value) {
    return {
      type: 'SET_PROPERTY',
      algorithm: alg,
      property: prop,
      value: value
    }
  },

  runAlgorithm: function(id) {
    return {
      type: 'RUN_ALGORITHM',
      id: id
    }
  },

  createGraph: function() {
    return {
      type: "CREATE_GRAPH"
    }
  },

  deleteGraph: function(id) {
    return {
      type: "DELETE_GRAPH",
      id: id
    }
  },

  refreshFiles: function() {
    return {
      type: 'REFRESH_FILES'
    }
  }

}

export default actions
