import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import RaisedButton from 'material-ui/lib/raised-button'
import Toggle from 'material-ui/lib/toggle'
import View from 'react-flexbox'

import MantidButton from './MantidButton'
import NewGraphDialog from './NewGraphDialog'

var MantidGraphs = React.createClass({

  render: function() {

    var graphList;

    if(Object.keys(this.props.graphs).length > 0) {
      graphList = Object.keys(this.props.graphs).map((key) => {
        return <p>Algorithm {key}</p>
      })
      graphList.push(<View column key="spacer" />)
    } else {
      graphList = (
        <Card zDepth={3} style={{marginTop: 10, padding: 30, width: 600}}>
          <CardTitle
            title="No Graphs"
          />
          <CardText>
            <p>You have not created any graphs yet. You can use the New button above to create one.</p>
          </CardText>
        </Card>
      )
    }

    return (
      <View column
        style={{marginBottom: 40}}
      >
        <div>
          <View row>
            <NewGraphDialog
              buttonStyle={{marginTop: 10, marginRight: 10}}
              actions={this.props.actions}
              curves={this.props.curves}
            />
          </View>
        </div>
        <View column>
          {graphList}
        </View>
      </View>
    )
  }
})

export default MantidGraphs
