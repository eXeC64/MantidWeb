import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/SelectField'
import RaisedButton from 'material-ui/lib/raised-button'

var NewGraphDialog = React.createClass({

  getInitialState: function() {
    return {
      open: false,
    }
  },

  handleOpen: function() {
    this.setState({open: true})
  },

  handleClose: function() {
    this.setState({open: false})
  },

  handleSubmit: function() {
    //do stuff
    this.setState({open: false})
  },

  render: function() {
    const actions = [
      <RaisedButton
        label="Cancel"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>cancel</FontIcon>}
        onTouchTap={this.handleClose}
        style={{margin: 5}}
      />,
      <RaisedButton
        label="Create"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>add</FontIcon>}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        onTouchTap={this.handleSubmit}
        style={{margin: 5}}
      />
    ]

    return (
      <div>
        <RaisedButton
          label="New Graph"
          icon={<FontIcon className="material-icons" style={{color:colors.white}}>add</FontIcon>}
          backgroundColor={colors.green500}
          labelColor={colors.white}
          onTouchTap={this.handleOpen}
          style={this.props.buttonStyle}
        />
        <Dialog
          title="Create New Graph"
          actions={actions}
          modal={false}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
        >
          <p>Do stuff here</p>
        </Dialog>
      </div>
    )
  }
})

export default NewGraphDialog
