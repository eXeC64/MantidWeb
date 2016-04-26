import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'

var NewAlgorithmDialog = React.createClass({

  getInitialState: function() {
    return {
      open: false,
      value: 0
    }
  },

  handleOpen: function() {
    this.setState({open: true})
  },

  handleClose: function() {
    this.setState({open: false})
  },

  handleSelect: function(event) {
    this.setState({value: event.target.value})
  },

  handleSubmit: function() {
    var alg = this.props.algorithms[this.state.value];
    this.props.actions.createAlgorithm(alg.name, alg.version);
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

    const selectStyle = {
      borderRadius: "1em",
      padding: "0.5em",
      backgroundColor: colors.green100,
      border: 0,
      fontSize: "1.25em"
    }

    var i = 0;
    var options = Object.keys(this.props.algorithms).map((key) => {
      const name = this.props.algorithms[key].name + "-v" + this.props.algorithms[key].version;
      return <option value={i++}>{name}</option>
    });

    return (
      <div>
        <RaisedButton
          label="New Algorithm"
          icon={<FontIcon className="material-icons" style={{color:colors.white}}>add</FontIcon>}
          backgroundColor={colors.green500}
          labelColor={colors.white}
          onTouchTap={this.handleOpen}
          style={this.props.buttonStyle}
        />
        <Dialog
          title="Create New Algorithm"
          actions={actions}
          modal={false}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
        >
          <p>Please select an algorithm to create.</p>
          <select
            style={selectStyle}
            onChange={this.handleSelect}
            value={this.state.value}
          >
            {options}
          </select>
        </Dialog>
      </div>
    )
  }
})

export default NewAlgorithmDialog
