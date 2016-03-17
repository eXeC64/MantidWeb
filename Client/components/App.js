import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../redux/actions'

import AppBar from 'material-ui/lib/app-bar'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import Divider from 'material-ui/lib/divider'
import FontIcon from 'material-ui/lib/font-icon';
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Paper from 'material-ui/lib/paper'
import RaisedButton from 'material-ui/lib/raised-button'
import {Tabs, Tab} from 'material-ui/lib/tabs'
import View from 'react-flexbox'


import MantidWorkspaces from './MantidWorkspaces'
import MantidAlgorithms from './MantidAlgorithms'
import MantidGraphs from './MantidGraphs'

import MenuListItem from './MenuListItem'

var App = React.createClass({

  getInitialState: function() {
    return {
      interface: 'algorithms'
    }
  },

  doConnect: function() {
    this.props.actions.mantidConnect(
        document.getElementById('mantid_url').value,
        document.getElementById('mantid_token').value
    )
  },

  doDisconnect: function() {
    this.props.actions.mantidDisconnect()
  },

  selectInterface: function(iface) {
    this.setState({interface: iface})
  },

  render: function() {

    const intWorkspaces = (
      <MantidWorkspaces
        workspaces={this.props.workspaces}
      />
    )
    const intAlgorithms = (
      <MantidAlgorithms
        actions={this.props.actions}
        algorithms={this.props.algorithms}
        usable_algorithms={this.props.usable_algorithms}
      />
    )
    const intGraphs = (
      <MantidGraphs
        actions={this.props.actions}
        graphs={this.props.graphs}
      />
    )

    const intData = (
      <Card zDepth={3} style={{margin: "auto", padding: 30, width: 600}}>
        <h1>TODO: Data Browser</h1>
        <p>
          This is the data interface. Its purpose is to provide a basic
          filesystem view of the user's storage area, which they can load
          workspaces from, and save them to.
        </p>
      </Card>
    )

    const intError = (
      <h1>Error, invalid interface selected</h1>
    )

    var curInterface = intError;

    switch(this.state.interface) {
      case "workspaces":
        curInterface = intWorkspaces
        break
      case "algorithms":
        curInterface = intAlgorithms
        break
      case "graphs":
        curInterface = intGraphs
        break
      case "data":
        curInterface = intData
        break
    }

    var mantidWeb = (
      <View row>
        <div>
          <Paper zDepth={2} style={{margin: 10}}>
            <List subheader="Menu">
              <MenuListItem
                title="Algorithms"
                icon="functions"
                selected={this.state.interface == 'algorithms'}
                onTouchTap={() => this.selectInterface("algorithms")}
              />
              <MenuListItem
                title="Workspaces"
                icon="storage"
                selected={this.state.interface == 'workspaces'}
                onTouchTap={() => this.selectInterface("workspaces")}
              />
              <MenuListItem
                title="Graphs"
                icon="show_chart"
                selected={this.state.interface == 'graphs'}
                onTouchTap={() => this.selectInterface("graphs")}
              />
              <MenuListItem
                title="Data"
                icon="cloud"
                selected={this.state.interface == 'data'}
                onTouchTap={() => this.selectInterface("data")}
              />
            </List>
            <Divider />
            <List subheader="Miscellaneous">
              <MenuListItem
                title="Help"
                icon="help"
              />
              <MenuListItem
                title="Disconnect"
                icon="power_settings_new"
                onTouchTap={this.doDisconnect}
              />
            </List>
          </Paper>
        </div>
        <View column>
          {curInterface}
        </View>
      </View>
    )

    var notConnected = (
      <Card style={
        {
          textAlign: "center",
          width: 300,
          margin: "auto",
          marginTop: 150,
          padding: 50
        }
      }>
        <h1>Offline</h1>
        <RaisedButton label="Connect" primary={true} onTouchTap={this.doConnect} />
      </Card>
    )

    return (
      <div className="app">
        <AppBar
          title="MantidWeb"
          showMenuIconButton={false}
          style={{backgroundColor: colors.green500}}
        />
        { this.props.status === 'connected' ? mantidWeb : notConnected }
      </div>
    )
  },
})

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
