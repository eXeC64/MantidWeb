import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import * as colors from 'material-ui/lib/styles/colors'
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button'
import Toggle from 'material-ui/lib/toggle'
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import View from 'react-flexbox'

import MantidButton from './MantidButton'
import AddCurveDialog from './AddCurveDialog'

var MantidGraphs = React.createClass({

  getInitialState: function() {
    return {
      currentGraph: (Object.keys(this.props.graphs).length > 0) ? Object.keys(this.props.graphs)[0] : ""
    }
  },

  componentWillReceiveProps: function(props) {
    //Select/Unselect a current graph as appropriate
    if(this.state.currentGraph == "") {
      if(Object.keys(props.graphs).length > 0)
        this.setState({currentGraph: Object.keys(props.graphs)[0]});
    } else {
      //Current graph deleted
      if(!Object.keys(props.graphs).includes(this.state.currentGraph)) {
        //Select the first graph if there is one, otherwise deselect
        if(Object.keys(props.graphs).length > 0)
          this.setState({currentGraph: Object.keys(props.graphs)[0]});
        else
          this.setState({currentGraph: ""});
      }
    }
  },

  createGraph: function() {
    this.props.actions.createGraph();
  },

  selectGraph: function(event, index, value) {
    this.setState({currentGraph: value});
  },

  deleteGraph: function() {
    this.props.actions.deleteGraph(this.state.currentGraph);
  },

  render: function() {

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
          <h1>{curGraph.title}</h1>
          <p>This is a graph</p>
        </Card>
      )
    }

    let graphSelector = (
      <DropDownMenu value={0} disabled={true}>
        <MenuItem value={0} primaryText="No Graphs Available" />
      </DropDownMenu>
    );

    if (Object.keys(this.props.graphs).length > 0) {
      graphSelector = (
       <DropDownMenu
         value={this.state.currentGraph}
         onChange={this.selectGraph}
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
        <Card style={{backgroundColor: "white", marginTop: 10, marginRight: 10, padding: 5}}>
          {graphSelector}
          <MantidButton
            label="New Graph"
            icon="add"
            style={{marginRight: 10}}
            onTouchTap={this.createGraph}
          />
          <AddCurveDialog
            buttonStyle={{marginRight: 10}}
            curves={this.props.curves}
          />
          <MantidButton
            label="Delete"
            icon="delete"
            style={{marginRight: 10}}
            disabled={this.state.currentGraph == ""}
            onTouchTap={this.deleteGraph}
            backgroundColor={colors.red500}
          />
        </Card>
        <View column>
          {graph}
        </View>
      </View>
    )
  }
})

export default MantidGraphs
