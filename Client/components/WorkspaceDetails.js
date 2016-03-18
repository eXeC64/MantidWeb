import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Dialog from 'material-ui/lib/dialog'
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button'

var WorkspaceDetails = React.createClass({

  render: function() {
    const actions = [
      <RaisedButton
        label="Create"
        icon={<FontIcon className="material-icons" style={{color:colors.white}}>add</FontIcon>}
        backgroundColor={colors.green500}
        labelColor={colors.white}
        onTouchTap={this.handleSubmit}
        style={{margin: 5}}
      />
    ]

    if(!this.props.open) {
      return <div />
    }

    return (
      <Dialog
        title={this.props.workspace.name}
        modal={false}
        open={this.props.open}
        onTouchTap={this.props.onClose}
        onRequestClose={this.props.onClose}
      >
        <p>Detailed information about this workspace goes here.</p>
      </Dialog>
    )
  }
})

export default WorkspaceDetails
