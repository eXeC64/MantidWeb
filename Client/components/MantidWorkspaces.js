import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'

import WorkspaceCard from './WorkspaceCard'

var MantidWorkspaces = React.createClass({

  render: function() {
    const cards = Object.keys(this.props.workspaces).map((key) => {
      return <WorkspaceCard workspace={this.props.workspaces[key]} />
    })

    if(Object.keys(this.props.workspaces).length > 0) {
      return <div>{cards}</div>
    } else {
      return (
        <Card zDepth={3} style={{margin: "auto", padding: 30, width: 600}}>
          <CardTitle
            title="No Workspaces"
          />
          <CardText>
            <p>
              You have not created any workspaces yet.
              You can load your data using the Data interface, or create a
              workspace using an algorithm.
            </p>
          </CardText>
        </Card>
      )
    }
  }
})

export default MantidWorkspaces
