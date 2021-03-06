import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/SelectField'
import RaisedButton from 'material-ui/lib/raised-button'

import CurveList from './CurveList'

var AddCurveDialog = React.createClass({

  getDefaultProps: function() {
    return {
      icon: "add",
      label: "Add Curves",
      disabled: false
    }
  },

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
    this.setState({open: false})
  },

  render: function() {
    const actions = [
      <FlatButton
        label="Cancel"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>cancel</FontIcon>}
        onTouchTap={this.handleClose}
        style={{margin: 5}}
      />,
      <RaisedButton
        label="Add"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>add</FontIcon>}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        onTouchTap={this.handleSubmit}
        style={{margin: 5}}
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
          title="Add Curves"
          actions={actions}
          modal={false}
          open={this.state.open}
          onTouchTap={this.handleClose}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <CurveList
            curves={this.props.curves}
            selected=""
            onSelect={function(){}}
          />
        </Dialog>
      </span>
    )
  }
})

export default AddCurveDialog
