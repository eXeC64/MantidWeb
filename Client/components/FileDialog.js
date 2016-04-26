import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import DirectoryList from './DirectoryList'

var FileDialog = React.createClass({

  getInitialState: function() {
    return {
      open: false,
      path: "",
    }
  },

  getDefaultProps: function() {
    return {
      action: "load",
      defaultPath: "",
      buttonStyle: {}
    }
  },

  handleOpen: function() {
    this.setState({open: true})
  },

  handleClose: function() {
    this.setState({open: false})
  },

  handleRefresh: function() {
    if(this.props.action == "load")
      this.setState({path: ""});
    this.props.actions.refreshFiles();
  },

  handleSelect: function(value) {
    this.setState({path: value});
  },

  handleEdit: function(event) {
    this.setState({path: event.target.value});
  },

  handleSubmit: function() {
    var alg = this.props.algorithms[this.state.value];
    this.props.actions.createAlgorithm(alg.name, alg.version);
    this.setState({open: false})
  },

  render: function() {

    const actionLabel = this.props.action == "load" ? "Load" : "Save";
    const icon = this.props.action == "load" ? "cloud_download" : "cloud_upload";
    const actionDisabled = this.state.path.length == 0

    const actions = [
      <RaisedButton
        label="Refresh"
        icon={<FontIcon className="material-icons">refresh</FontIcon>}
        onTouchTap={this.handleRefresh}
        style={{margin: 5}}
      />,
      <RaisedButton
        label="Cancel"
        icon={<FontIcon className="material-icons">cancel</FontIcon>}
        onTouchTap={this.handleClose}
        style={{margin: 5}}
      />,
      <TextField
        floatingLabelText="Filename"
        value={this.state.path}
        onChange={this.handleEdit}
        style={{marginLeft: "25px", marginRight: "5px"}}
        disabled={this.props.action == "load"}
      />,
      <RaisedButton
        label={actionLabel}
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>{icon}</FontIcon>}
        disabled={actionDisabled}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        onTouchTap={this.handleSubmit}
        style={{margin: 5}}
      />
    ]


    return (
      <div style={{display: "inline"}}>
        <RaisedButton
          label={actionLabel}
          icon={<FontIcon className="material-icons" style={{color:colors.white}}>{icon}</FontIcon>}
          backgroundColor={colors.green500}
          labelColor={colors.white}
          onTouchTap={this.handleOpen}
          style={this.props.buttonStyle}
          disabled={this.props.disabled}
        />
        <Dialog
          title={actionLabel}
          actions={actions}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <DirectoryList
            files={this.props.files}
            selected={this.state.path}
            onSelect={this.handleSelect}
          />
        </Dialog>
      </div>
    )
  }
})

export default FileDialog
