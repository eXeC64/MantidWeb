import React from 'react'

import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/lib/card'
import Checkbox from 'material-ui/lib/checkbox'
import * as colors from 'material-ui/lib/styles/colors'
import Divider from 'material-ui/lib/divider'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import SelectField from 'material-ui/lib/SelectField'
import MenuItem from 'material-ui/lib/menus/menu-item'
import TextField from 'material-ui/lib/text-field'
import Toggle from 'material-ui/lib/toggle'
import View from 'react-flexbox'

import PropertyHelpDialog from './PropertyHelpDialog'

var AlgorithmProperty = React.createClass({

  getInitialState: function() {
    return {value: this.props.property.value}
  },

  getDefaultProps: function() {
    return {property: {}, onChange: function(){}}
  },

  componentWillReceiveProps: function(props) {
    if(props.property.value != this.state.value) {
      this.setState({value: this.props.property.value});
    }
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
  },

  saveChanges: function() {
    if(this.props.property.value != this.state.value) {
      this.props.onChange(this.props.property.name, this.state.value);
    }
  },

  handleAndSaveChange: function(event, index, value) {
    this.setState({value: value});
    this.props.onChange(this.props.property.name, value);
  },

  render() {
    const propertyEditor = ((()=>{
      switch(this.props.property.type) {
        case "string":
        case "number":
        case "int list":
        case "dbl list":
        case "str list":
        case "Workspace":
        case "MatrixWorkspace":
        case "TableWorkspace":
        case "IEventWorkspace":
        case "IMDWorkspace":
        case "MDEventWorkspace":

          if(this.props.property.values.length > 1) {
            var items = [];
            for(var i = 0; i < this.props.property.values.length; i++) {
              items.push(
                <MenuItem
                  value={this.props.property.values[i]}
                  primaryText={this.props.property.values[i]}
                  key={i}
                />
              );
            }

            return (
              <SelectField
                floatingLabelText={this.props.property.name}
                value={this.state.value}
                onChange={this.handleAndSaveChange}
              >
                {items}
              </SelectField>
            )
          } else {
            return (
              <TextField
                floatingLabelText={this.props.property.name}
                value={this.state.value}
                errorText={this.props.property.error}
                onChange={this.handleChange}
                onBlur={this.saveChanges}
                onEnterKeyDown={this.saveChanges}
                hintText={this.props.property.type}
              />
            )
          }
          break;
        case "boolean":
          return (
            <Toggle
              label={this.props.property.name}
              style={{marginTop: 40}}
              defaultToggled={this.props.property.value === "1"}
            />
          )
          break;
        default:
          return <p>Unsupported type: {this.props.property.type}</p>
      }
      })()
    )

    return (
      <div
        style={{width: 300, margin: 10}}
      >
        <View row>
        {propertyEditor}
          <PropertyHelpDialog property={this.props.property} />
        </View>
      </div>
    )
  }
})

export default AlgorithmProperty
