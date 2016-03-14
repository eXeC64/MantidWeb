import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import RaisedButton from 'material-ui/lib/raised-button'
import Toggle from 'material-ui/lib/toggle'
import View from 'react-flexbox'

import AlgorithmCard from './AlgorithmCard'
import MantidButton from './MantidButton'
import MenuListItem from './MenuListItem'
import NewAlgorithmDialog from './NewAlgorithmDialog'

var MantidAlgorithms = React.createClass({

  render: function() {

    var algList;

    if(Object.keys(this.props.algorithms).length > 0) {
      algList = Object.keys(this.props.algorithms).map((key) => {
        return (
          <AlgorithmCard
            algorithm={this.props.algorithms[key]}
            actions={this.props.actions}
            key={key}
          />
        )
      })
      algList.push(<View column key="spacer" />)
    } else {
      algList = (
        <Card zDepth={3} style={{margin: "auto", padding: 30, width: 600}}>
          <CardTitle
            title="No Algorithm Instances"
          />
          <CardText>
            <p>You have not created any algorithms yet. You can use the New button above to run one.</p>
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
            <NewAlgorithmDialog
              buttonStyle={{marginTop: 10, marginRight: 10}}
              algorithms={this.props.usable_algorithms}
              actions={this.props.actions}
            />
          </View>
        </div>
        <View column>
          {algList}
        </View>
      </View>
    )
  }
})

export default MantidAlgorithms
