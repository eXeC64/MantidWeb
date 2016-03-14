import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import Popover from 'material-ui/lib/popover/popover'
import SelectField from 'material-ui/lib/SelectField'
import RaisedButton from 'material-ui/lib/raised-button'

var PropertyHelpDialog = React.createClass({

  getInitialState: function() {
    return {open: false}
  },

  handleOpen: function(event) {
    this.setState({open: true, anchorEl: event.currentTarget})
  },

  handleClose: function() {
    this.setState({open: false})
  },

  render: function() {

    if(this.props.property.help == "") {
      return <div />
    }

    const actions = [
      <RaisedButton
        label="Ok"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>done</FontIcon>}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        style={{margin: 5}}
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <div>
        <IconButton
          onTouchTap={this.handleOpen}
          style={{marginTop: 30}}
        >
          <FontIcon className="material-icons">info_outline</FontIcon>
        </IconButton>
        <Popover
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
          zDepth={5}
          style={{
            borderStyle: "solid",
            backgroundColor: colors.green100,
            borderColor: colors.green400,
            borderWidth: 1
          }}
        >
          <p style={{margin: 10, maxWidth: 300}}>{this.props.property.help}</p>
        </Popover>
      </div>
    )
  }
})

export default PropertyHelpDialog
