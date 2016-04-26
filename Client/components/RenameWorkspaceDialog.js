import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'

var RenameWorkspaceDialog = React.createClass({

  getDefaultProps: function() {
    return {
      icon: "create",
      label: "Rename",
      disabled: false,
      oldName: "",
      onRename: function(){},
    }
  },

  getInitialState: function() {
    return {
      open: false,
      newName: "",
    }
  },

  handleOpen: function() {
    this.setState({open: true, newName: ""})
  },

  handleClose: function() {
    this.setState({open: false})
  },

  handleChange: function(event) {
    this.setState({newName: event.target.value})
  },

  handleSubmit: function() {
    this.setState({open: false});
    this.props.onRename();
    this.props.actions.renameWorkspace(this.props.oldName, this.state.newName);
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
        label="Rename"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>create</FontIcon>}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        onTouchTap={this.handleSubmit}
        style={{margin: 5}}
        disabled={this.state.newName.length < 1}
      />
    ]

    return (
      <span>
        <RaisedButton
          label={this.props.label}
          icon={<FontIcon className="material-icons" style={{color:colors.white}}>{this.props.icon}</FontIcon>}
          backgroundColor={colors.green500}
          labelColor={colors.white}
          onTouchTap={this.handleOpen}
          style={this.props.buttonStyle}
          disabled={this.props.disabled}
        />
        <Dialog
          title={"Rename " + this.props.oldName}
          actions={actions}
          modal={false}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
        >
          <TextField
            floatingLabelText="Rename to"
            value={this.state.newName}
            hintText="new name"
            onChange={this.handleChange}
            onEnterKeyDown={(this.state.newName.length > 0) ? this.handleSubmit : {}}
          />
        </Dialog>
      </span>
    )
  }
})

export default RenameWorkspaceDialog
