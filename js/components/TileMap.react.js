var React = require('react'),
  Router = require('react-router');

var TileMap = React.createClass({
  mixins: [Router.State],
  render: function () {
    return (
      <div>
        <h1>Tile map</h1>
        <div>{this.getParams().uuid}</div>
      </div>
    );
  }
});

module.exports = TileMap;
