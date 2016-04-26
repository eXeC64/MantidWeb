import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import FontIcon from 'material-ui/lib/font-icon'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

var DirectoryList = React.createClass({

  getDefaultProps: function() {
    return {
      files: [],
      selected: "",
      onSelect: function(){}
    }
  },

  handleSelect: function(event, value) {
    this.props.onSelect(value);
  },

  render: function() {
    if(this.props.files.status == "refreshing") {
      return (
        <div style={{position: "relative", margin: "50px", textAlign: "center"}} >
          <RefreshIndicator
            left={0}
            top={0}
            size={75}
            status="loading"
            style={{display: "inline-block", position: "relative"}}
          />
        </div>
      )
    } else if(this.props.files.status == "ready") {
      const items = this.props.files.list.map((item) => {
        const icon = item.type == "file" ? "description" : "folder";
        return (
          <ListItem
            primaryText={item.name}
            value={item.name}
            key={item.name}
            leftIcon={<FontIcon className="material-icons">{icon}</FontIcon>}
          />
        )
      });

      return (
        <SelectableList
          subheader="Files"
          value={this.props.selected}
          valueLink={{value: this.props.selected, requestChange: this.handleSelect}}
        >
          {items}
        </SelectableList>
      )
    }
  }
})

export default DirectoryList
