import React from 'react'

import Plotly from 'plotly.js';

var Graph = React.createClass({

  getDefaultProps: function() {
    return {
      title: "",
      data: {}
    }
  },

  componentDidMount: function() {

    let layout = {
      title: this.props.title,
    };

    Plotly.newPlot(this.container, this.props.data, layout, {displaylogo: false});

    //Delete cruft
    var cruft = document.getElementById("js-plotly-tester");
    cruft.parentNode.removeChild(cruft);
  },

  componentDidUpdate: function() {
    Plotly.redraw(this.container);

    //Delete cruft
    var cruft = document.getElementById("js-plotly-tester");
    cruft.parentNode.removeChild(cruft);
  },

  render: function() {
    return <div ref={(node) => this.container=node} />
  }

});

export default Graph;
