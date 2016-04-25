import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/SelectField'
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

  handleSelect: function(event, index, value) {
    this.setState({value: value})
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

    const items = Object.keys(this.props.algorithms).map((key) => {
      var alg = this.props.algorithms[key];
        return (
          <MenuItem
            value={key}
            key={key}
            primaryText={alg.name+"-v"+alg.version}
          />
        )
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
          <SelectField
            fullWidth={true}
            maxHeight={500}
            value={this.state.value}
            onChange={this.handleSelect}
            floatingLabelText="Algorithm"
          >
            {items}
          </SelectField>
        </Dialog>
      </div>
    )
  }
})

export default NewAlgorithmDialog
