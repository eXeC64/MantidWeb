import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card';
import * as colors from 'material-ui/lib/styles/colors';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item'
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button'
import Toggle from 'material-ui/lib/toggle';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import View from 'react-flexbox';

import MantidButton from './MantidButton'
import AddCurveDialog from './AddCurveDialog'
import Graph from './Graph'

var MantidGraphs = React.createClass({

  getInitialState: function() {
    return {
      currentGraph: (Object.keys(this.props.graphs).length > 0) ? Object.keys(this.props.graphs)[0] : "",
      switchPending: false //If we just created a new graph, we should switch to it automatically
    }
  },

  componentWillReceiveProps: function(props) {
    const newGraphs = Object.keys(props.graphs);
    const oldGraphs = Object.keys(this.props.graphs);

    if(this.state.switchPending) {
      //If a graph was just added, let's switch to it
      if(newGraphs.length > oldGraphs.length) {
        for(let i = 0; i < newGraphs.length; ++i) {
          if(!oldGraphs.includes(newGraphs[i])) {
            this.setState({currentGraph: newGraphs[i], switchPending: false});
            return;
          }
        }
      }
    }

    //Select/Unselect a current graph as appropriate
    if(this.state.currentGraph == "") {
      if(newGraphs.length > 0)
        this.setState({currentGraph: newGraphs[0]});
    } else {
      //Current graph deleted
      if(!newGraphs.includes(this.state.currentGraph)) {
        //Select the last remaining graph, otherwise deselect
        if(newGraphs.length > 0)
          this.setState({currentGraph: newGraphs[newGraphs.length-1]});
        else
          this.setState({currentGraph: ""});
      }
    }
  },

  createGraph: function() {
    this.props.actions.createGraph();
    this.setState({switchPending: true});
  },

  selectGraph: function(event, index, value) {
    this.setState({currentGraph: value});
  },

  deleteGraph: function() {
    this.props.actions.deleteGraph(this.state.currentGraph);
  },

  render: function() {

    let data = [{
      type: 'scatter',
      x: [1, 2, 3],
      y: [6, 2, 3]
    }];

    var graph = (
      <Card key="no-graph" style={{marginTop: 10, padding: 30, width: 600}}>
        <CardTitle
          title="No Graphs"
        />
        <CardText>
          <p>You have not created any graphs yet. You can use the New button above to create one.</p>
        </CardText>
      </Card>
    );

    if(this.state.currentGraph != "") {
      let curGraph = this.props.graphs[this.state.currentGraph];
      graph = (
        <Card key="graph" style={{marginTop: 10, marginRight: 10, padding: 10}}>
          <Graph title={curGraph.title} data={data} />
        </Card>
      )
    }

    let graphSelectorStyle = {
      backgroundColor: "white",
      border: "1px solid #aaa",
      borderRadius: "3px",
      marginTop: 10,
      marginRight: 10,
      paddingBottom: 7
    };

    let graphSelector = (
      <DropDownMenu style={graphSelectorStyle} value={0} disabled={true}>
        <MenuItem value={0} primaryText="No Graphs Available" />
      </DropDownMenu>
    );

    if (Object.keys(this.props.graphs).length > 0) {
      graphSelector = (
       <DropDownMenu
         value={this.state.currentGraph}
         onChange={this.selectGraph}
         style={graphSelectorStyle}
       >
        {
          Object.keys(this.props.graphs).map((id) => {
            return <MenuItem key={id} value={id} primaryText={this.props.graphs[id].title} />;
          })
        }
       </DropDownMenu>
      )
    }

    return (
      <View column
        style={{marginBottom: 40}}
      >
        <div>
          {graphSelector}
          <MantidButton
            label="New Graph"
            icon="insert_chart"
            style={{marginRight: 10}}
            onTouchTap={this.createGraph}
          />
          <AddCurveDialog
            buttonStyle={{marginRight: 10}}
            curves={this.props.curves}
            disabled={this.state.currentGraph == ""}
            icon="show_chart"
          />
          <MantidButton
            label="Delete"
            icon="delete"
            style={{marginRight: 10}}
            disabled={this.state.currentGraph == ""}
            onTouchTap={this.deleteGraph}
            backgroundColor={colors.red500}
          />
        </div>
        <View column>
          {graph}
        </View>
      </View>
    )
  }
})

export default MantidGraphs
