import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import List from 'material-ui/lib/lists/list'

import MantidButton from './MantidButton'
import NewGraphDialog from './NewGraphDialog'
import WorkspaceItem from './WorkspaceItem'

var MantidWorkspaces = React.createClass({

  getInitialState: function() {
    return {
      selected: []
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

  render: function() {

    const actionBar = (
      <div>
        <MantidButton
          label="Load"
          icon="cloud_download"
          style={{marginTop: 10, marginRight: 10}}
        />
        <MantidButton
          label="Save"
          icon="cloud_upload"
          style={{marginTop: 10, marginRight: 10}}
          disabled={this.state.selected.length != 1}
        />
        <NewGraphDialog
          label="Graph"
          icon="insert_chart"
          buttonStyle={{marginTop: 10, marginRight: 10}}
          actions={this.props.actions}
          disabled={this.state.selected.length != 1}
        />
        <MantidButton
          label="Rename"
          icon="create"
          style={{marginTop: 10, marginRight: 10}}
          disabled={this.state.selected.length != 1}
        />
        <MantidButton
          label="Delete"
          icon="delete"
          style={{marginTop: 10, marginRight: 10}}
          backgroundColor={colors.red900}
          disabled={this.state.selected.length < 1}
        />
      </div>
    )

    const items = Object.keys(this.props.workspaces).map((key) => {
      return (
        WorkspaceItem({
          key: key,
          workspace: this.props.workspaces[key],
          onSelect: this.toggleSelection,
          selected: this.state.selected
        })
      )
    })

    if(Object.keys(this.props.workspaces).length > 0) {
      return (
        <div>
          {actionBar}
          <Card zDepth={2} style={{marginTop: 10, width: 750}}>
            <List subheader="Workspaces">
              {items}
            </List>
          </Card>
        </div>
      )
    } else {
      return (
        <Card zDepth={3} style={{margin: "auto", padding: 30, width: 600}}>
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
      )
    }
  }
})

export default MantidWorkspaces
