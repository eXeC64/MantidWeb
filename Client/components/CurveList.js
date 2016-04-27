import React from 'react'

import Checkbox from 'material-ui/lib/checkbox';
import * as colors from 'material-ui/lib/styles/colors'
import FontIcon from 'material-ui/lib/font-icon'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

var CurveList = React.createClass({

  getDefaultProps: function() {
    return {
      curves: [],
      selected: "",
      onSelect: function(){}
    }
  },

  handleSelect: function(event, value) {
    this.props.onSelect(value);
  },

  render: function() {
    let byWorkspace = {};
    Object.keys(this.props.curves).map((key) => {
      let item = this.props.curves[key];
      byWorkspace = {
        ...byWorkspace,
        [item.workspace]: ((byWorkspace[item.workspace])
          ?  [...byWorkspace[item.workspace], item]
          : [item])
      }
    });

    let items = Object.keys(byWorkspace).map((wsName) => {
      let curves = Object.keys(byWorkspace[wsName]).map((curveName) => {
        let curve = byWorkspace[wsName][curveName];
        return (
          <ListItem
            primaryText={curve.name}
            value={curve.name}
            key={curve.name}
            leftCheckbox={<Checkbox />}
          />
        );
      });

      return (
        <ListItem
          primaryText={wsName}
          value={wsName}
          key={wsName}
          leftIcon={<FontIcon className="material-icons">storage</FontIcon>}
          nestedItems={curves}
          primaryTogglesNestedList={true}
        />
      )
    });

    return (
      <List
        style={{height: 400}}
        subheader="Workspaces"
        value={this.props.selected}
        // valueLink={{value: this.props.selected, requestChange: this.handleSelect}}
      >
        {items}
      </List>
    )
  }
})

export default CurveList
