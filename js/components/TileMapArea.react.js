var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config'),
  viewer = null;

var TileMapArea = React.createClass({
  componentDidMount: function () {
    var uuid = this.props.uuid;
    console.log('start tileviewer code here for: ' + uuid);
    // set the variables for the tile viewer based on data fetched from the server

  },

  componentWillUnmount: function() {
    console.log('stop tileviewer code');
    if (viewer) {
      viewer.destroy();
      viewer = null;
    }
  },

  render: function() {
    if (this.props.instances.hasOwnProperty('graytiles')) {
      return (
          <div>
            <p>Tilemap image viewer goes here</p>
            <div id="viewer" className="openseadragon"></div>
          </div>
      );
    }
    else {
      return (
          <p>no graytiles data set.</p>
      );
    }
  }
});

module.exports = TileMapArea;
