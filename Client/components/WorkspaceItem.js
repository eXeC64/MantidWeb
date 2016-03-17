import React from 'react'

import * as colors from 'material-ui/lib/styles/colors'
import Checkbox from 'material-ui/lib/checkbox'
import Divider from 'material-ui/lib/divider'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'
import View from 'react-flexbox'
import ListItem from 'material-ui/lib/lists/list-item'

var WorkspaceItem = function(props) {

    const cardIcon = (
      <FontIcon className="material-icons">storage</FontIcon>
    )

    var workspaceDetails;
    switch(props.workspace.type)
    {
      case "Workspace2D":
        workspaceDetails = (
          <div>
            <p>Histograms: {props.workspace.numHistograms}</p>
            <p>Bins: {props.workspace.numBins}</p>
          </div>
        )
        break;
      default:
        workspaceDetails = (
          <p>Detailed information unavailable.</p>
        )
    }

    const children = Object.keys(props.workspace.children).map((key) => {
      return WorkspaceItem({
        key: key,
        workspace: props.workspace.children[key],
        onSelect: props.onSelect,
        selected: props.selected
      })
    })

    var subtitle = props.workspace.type;
    if(props.workspace.title.length > 0) {
      subtitle = subtitle + " - " + props.workspace.title;
    }

    return (
      <ListItem
        key={props.key}
        primaryText={props.workspace.name}
        secondaryText={subtitle}
        leftCheckbox={(
          <Checkbox
            onCheck={() => {props.onSelect(props.workspace.name)}}
            checked={props.selected.includes(props.workspace.name)}
          />
        )}
        autoGenerateNestedIndicator={false}
        initiallyOpen={true}
        nestedItems={children}
      />
    )
}

export default WorkspaceItem
