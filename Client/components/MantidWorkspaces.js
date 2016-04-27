import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import List from 'material-ui/lib/lists/list'

import MantidButton from './MantidButton'
import NewGraphDialog from './NewGraphDialog'
import RenameWorkspaceDialog from './RenameWorkspaceDialog'
import WorkspaceDetails from './WorkspaceDetails'
import WorkspaceItem from './WorkspaceItem'
import FileDialog from './FileDialog'

var MantidWorkspaces = React.createClass({

  getInitialState: function() {
    return {
      selected: [],
      infoOpen: false,
      infoWorkspace: {}
    }
  },

  toggleSelection: function(name) {
    var add = !this.state.selected.includes(name);

    if(add) {
      this.setState({
        selected: [
          ...this.state.selected,
          name
        ]
      });
    } else {
      this.setState({
        selected: this.state.selected.filter((key) => key != name)
      });
    }
  },

  showInfo: function(ws) {
    this.setState({
      infoOpen: true,
      infoWorkspace: ws
    })
  },

  hideInfo: function() {
    this.setState({
      infoOpen: false
    })
  },

  onDelete: function() {
    this.state.selected.map((name) => {
      this.props.actions.deleteWorkspace(name);
    })
    this.setState({
      selected: []
    });
  },

  onRename: function() {
    this.setState({
      selected: []
    });
  },

  render: function() {

    const firstSelected = (this.state.selected.length > 0) ? this.state.selected[0] : "";

    const actionBar = (
      <div>
        <FileDialog
          action="load"
          actions={this.props.actions}
          buttonStyle={{marginTop: 10, marginRight: 10}}
          files={this.props.files}
        />
        <FileDialog
          action="save"
          workspace={this.state.selected.length == 1 ? this.state.selected[0] : ""}
          actions={this.props.actions}
          buttonStyle={{marginTop: 10, marginRight: 10}}
          disabled={this.state.selected.length != 1}
          files={this.props.files}
        />
        <NewGraphDialog
          label="Graph"
          icon="insert_chart"
          buttonStyle={{marginTop: 10, marginRight: 10}}
          actions={this.props.actions}
          disabled={this.state.selected.length != 1}
          curves={this.props.curves}
        />
        <RenameWorkspaceDialog
          buttonStyle={{marginTop: 10, marginRight: 10}}
          actions={this.props.actions}
          disabled={this.state.selected.length != 1}
          oldName={firstSelected}
          actions={this.props.actions}
          onRename={this.onRename}
        />
        <MantidButton
          label="Delete"
          icon="delete"
          style={{marginTop: 10, marginRight: 10}}
          backgroundColor={colors.red900}
          disabled={this.state.selected.length < 1}
          onTouchTap={this.onDelete}
        />
      </div>
    )

    const items = Object.keys(this.props.workspaces).map((key) => {
      return (
        WorkspaceItem({
          key: key,
          workspace: this.props.workspaces[key],
          onSelect: this.toggleSelection,
          onInfo: this.showInfo,
          selected: this.state.selected
        })
      )
    })

    if(Object.keys(this.props.workspaces).length > 0) {
      return (
        <div>
          {actionBar}
          <Card key="workspaces" zDepth={2} style={{marginTop: 10, width: 750}}>
            <List subheader="Workspaces">
              {items}
            </List>
          </Card>
          <WorkspaceDetails
            open={this.state.infoOpen}
            workspace={this.state.infoWorkspace}
            onClose={this.hideInfo}
          />
        </div>
      )
    } else {
      return (
        <div>
          {actionBar}
          <Card key="no-workspaces" zDepth={3} style={{marginTop: 10, padding: 30, width: 600}}>
            <CardTitle
              title="No Workspaces"
            />
            <CardText>
              <p>
                You have not created any workspaces yet.
                You can load your data using the button above, or create a
                workspace using an algorithm.
              </p>
            </CardText>
          </Card>
        </div>
      )
    }
  }
})

export default MantidWorkspaces
