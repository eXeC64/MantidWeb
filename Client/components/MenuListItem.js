import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import FontIcon from 'material-ui/lib/font-icon'
import ListItem from 'material-ui/lib/lists/list-item'

var MenuListItem = React.createClass({

  getDefaultProps: function() {
    return {
      title: "Menu Item",
      icon: "help",
      selected: false,
      onTouchTap: function() {}
    }
  },


  render: function() {
    var bgCol = this.props.selected ? colors.green400 : colors.white;
    var fgCol = this.props.selected ? colors.white : colors.black;
    var icCol = this.props.selected ? colors.white : colors.grey600;

    return (
      <ListItem
        primaryText={this.props.title}
        leftIcon={<FontIcon className="material-icons" style={{color:icCol}}>{this.props.icon}</FontIcon>}
        style={{backgroundColor: bgCol, color: fgCol}}
        onTouchTap={this.props.onTouchTap}
      />
    )
  }
})

export default MenuListItem
