import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button'

var MantidButton = React.createClass({

  getDefaultProps: function() {
    return {
      label: "Button",
      icon: "help",
      backgroundColor: colors.green500,
      onTouchTap: function() {},
      disabled: false,
      style: {}
    }
  },

  render: function() {
    return (
      <RaisedButton
        label={this.props.label}
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>{this.props.icon}</FontIcon>}
        backgroundColor={this.props.backgroundColor}
        labelColor={colors.white}
        style={this.props.style}
        onTouchTap={this.props.onTouchTap}
        disabled={this.props.disabled}
      />
    )
  }
})

export default MantidButton
