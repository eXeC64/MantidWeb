import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import DirectoryList from './DirectoryList'

var FileDialog = React.createClass({

  getInitialState: function() {
    return {
      open: false,
      path: "",
      workspace: "", //For loading: the name of the workspace to create
    }
  },

  getDefaultProps: function() {
    return {
      workspace: "", //For saving, the workspace we're saving to disk
      action: "load",
      buttonStyle: {}
    }
  },

  handleOpen: function() {
    this.props.actions.refreshFiles();
    this.setState({open: true});
  },

  handleClose: function() {
    this.setState({open: false});
  },

  handleRefresh: function() {
    if(this.props.action == "load")
      this.setState({path: ""});
    this.props.actions.refreshFiles();
  },

  handleSelect: function(value) {
    this.setState({path: value});
  },

  handleEditPath: function(event) {
    this.setState({path: event.target.value});
  },

  handleEditName: function(event) {
    this.setState({workspace: event.target.value});
  },

  handleSubmit: function() {
    if(this.props.action == "load") {
      this.props.actions.loadWorkspace(this.state.workspace, this.state.path);
    } else if(this.props.action == "save") {
      this.props.actions.saveWorkspace(this.props.workspace, this.state.path);
    }
    this.setState({open: false})
  },

  render: function() {

    const isLoad = this.props.action == "load"
    const actionLabel = isLoad ? "Load" : "Save";
    const icon = isLoad ? "cloud_download" : "cloud_upload";
    const actionDisabled = this.state.path.length == 0 || (isLoad && this.state.workspace.length == 0);

    const actions = [
      <FlatButton
        label="Refresh"
        icon={<FontIcon className="material-icons">refresh</FontIcon>}
        onTouchTap={this.handleRefresh}
        style={{margin: 5}}
      />,
      <FlatButton
        label="Cancel"
        icon={<FontIcon className="material-icons">cancel</FontIcon>}
        onTouchTap={this.handleClose}
        style={{margin: 5}}
      />,
      <TextField
        floatingLabelText="Filename"
        value={this.state.path}
        onChange={this.handleEditPath}
        style={{marginLeft: "25px", marginRight: "5px", width: 200}}
        disabled={isLoad}
      />,
      <TextField
        floatingLabelText={"Workspace Name"}
        value={isLoad ? this.state.workspace : this.props.workspace}
        onChange={this.handleEditName}
        style={{marginLeft: "25px", marginRight: "5px", width: 150}}
        disabled={!isLoad}
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
          contentStyle={{minWidth: 800}}
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
