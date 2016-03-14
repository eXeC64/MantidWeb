import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import Divider from 'material-ui/lib/divider'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'
import View from 'react-flexbox'

import MantidButton from './MantidButton'

var WorkspaceCard = React.createClass({

  render: function() {
    const cardIcon = (
      <FontIcon className="material-icons">storage</FontIcon>
    )

    const actionBar = (
      <div>
        <MantidButton
          label="Save"
          icon="save"
          style={{marginTop: 10, marginRight: 10}}
        />
        <MantidButton
          label="Rename"
          icon="create"
          style={{marginTop: 10, marginRight: 10}}
        />
        <MantidButton
          label="Delete"
          icon="delete"
          style={{marginTop: 10, marginRight: 10}}
          backgroundColor={colors.red900}
        />
      </div>
    )

    var workspaceDetails;
    switch(this.props.workspace.type)
    {
      case "Workspace2D":
        workspaceDetails = (
          <div>
            <p>Histograms: {this.props.workspace.numHistograms}</p>
            <p>Bins: {this.props.workspace.numBins}</p>
          </div>
        )
        break;
      default:
        workspaceDetails = (
          <p>Detailed information unavailable.</p>
        )
    }

    return (
      <Card style={{marginTop: 10, marginRight: 10, maxWidth: 750}}>
        <CardHeader
          title={this.props.workspace.name}
          subtitle={this.props.workspace.type}
          actAsExpander={true}
          showExpandableButton={true}
          avatar={cardIcon}
        >
        </CardHeader>
        <Divider />
        <CardText expandable={true}>
          {actionBar}
          <Divider style={{marginTop:20}}/>
          {workspaceDetails}
        </CardText>
        <CardActions expandable={true}>
        </CardActions>
      </Card>
    )
  }
})

export default WorkspaceCard
