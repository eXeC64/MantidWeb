import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import CircularProgress from 'material-ui/lib/circular-progress'
import * as colors from 'material-ui/lib/styles/colors'
import Divider from 'material-ui/lib/divider'
import FontIcon from 'material-ui/lib/font-icon'
import LinearProgress from 'material-ui/lib/linear-progress'
import RaisedButton from 'material-ui/lib/raised-button'
import View from 'react-flexbox'

import AlgorithmProperty from './AlgorithmProperty'
import MantidButton from './MantidButton'

var AlgorithmCard = React.createClass({

  openAlgorithmHelp: function() {
    const base_url = "http://docs.mantidproject.org/nightly/algorithms/";
    const alg = this.props.algorithm.name + "-v" + this.props.algorithm.version
    window.open(base_url + alg + ".html", "_blank");
  },

  deleteAlgorithm: function() {
    this.props.actions.deleteAlgorithm(this.props.algorithm.id)
  },

  setProperty: function(name, value) {
    this.props.actions.setProperty(this.props.algorithm.id, name, value);
  },

  runAlgorithm: function() {
    this.props.actions.runAlgorithm(this.props.algorithm.id);
  },

  render: function() {

    var algIsRunnable = true;
    this.props.algorithm.properties.map((prop) => {
      if(prop.error != "") {
        algIsRunnable = false;
      }
    });

    const actionBar = (
      <View row>
        <MantidButton
          label="Run"
          icon="play_circle_filled"
          style={{marginTop: 10, marginRight: 10}}
          disabled={!algIsRunnable}
          onTouchTap={this.runAlgorithm}
        />
        <MantidButton
          label="Delete"
          icon="delete"
          backgroundColor={colors.red500}
          style={{marginTop: 10, marginRight: 10}}
          onTouchTap={this.deleteAlgorithm}
        />
        <View column />
        <MantidButton
          label="Documentation"
          icon="help"
          style={{marginTop: 10, marginRight: 10}}
          onTouchTap={this.openAlgorithmHelp}
        />
      </View>
    )

    var cardIcon;
    if(this.props.algorithm.state === "ready") {
      cardIcon = <FontIcon className="material-icons">query_builder</FontIcon>
    } else if(this.props.algorithm.state === "running") {
      cardIcon = <CircularProgress size={0.5} />
    } else if(this.props.algorithm.state === "completed") {
      cardIcon = <FontIcon className="material-icons">done</FontIcon>
    } else if(this.props.algorithm.state === "failed") {
      cardIcon = <FontIcon className="material-icons">error</FontIcon>
    } else {
      cardIcon = <FontIcon className="material-icons">functions</FontIcon>
    }


    const properties =
      Object.keys(this.props.algorithm.properties).map((key) => {
      var prop = this.props.algorithm.properties[key];
      return (
        <AlgorithmProperty
          actions={this.props.actions}
          property={prop}
          onChange={this.setProperty}
          key={key}
        />
      )
    })

    return (
      <Card zDepth={2} style={{marginTop: 10, marginRight: 10, maxWidth: 750}}>
        <CardHeader
          title={this.props.algorithm.name + "-v" + this.props.algorithm.version}
          subtitle={this.props.algorithm.state}
          actAsExpander={true}
          showExpandableButton={true}
          avatar={cardIcon}
        >
        </CardHeader>
        <LinearProgress
          mode="determinate"
          value={this.props.algorithm.progress * 100}
        />
        <CardText expandable={true}>
          {actionBar}
          <Divider style={{marginTop:20}}/>
          <h3>Properties</h3>
          <div style={{marginLeft: 20}}>
          {properties}
          </div>
          <Divider style={{margin:10, marginTop: 50}}/>
          {actionBar}
        </CardText>
        <CardActions expandable={true}>
        </CardActions>
      </Card>
    )
  }
})

export default AlgorithmCard
