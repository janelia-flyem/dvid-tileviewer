var React = require('react');

var TileCoordinates = React.createClass({

  getInitialState: function() {
    return {};
  },

  render: function () {
    console.log(this.props);
    var x = this.props.width,
      y = this.props.height,
      z = this.props.depth;

    if (this.props.plane === 1) {
      x = this.props.width;
      y = this.props.depth;
      z = this.props.height;
    }
    else if ( this.props.plane === 2) {
      x = this.props.depth;
      y = this.props.width;
      z = this.props.height;
    }

    return (
      <div>
        <p>X: {x}</p>
        <p>Y: {y}</p>
        <p>Z: {z}</p>
      </div>
    );
  }
});

module.exports = TileCoordinates;
