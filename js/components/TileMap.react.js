var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config');

var TileMap = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      repo: {}
    };
  },

  componentDidMount: function () {
    $.get(config.repoInfoUrl(this.state.uuid), function(result) {
      var repo = result;
      if (this.isMounted()) {
        this.setState({
          repo: repo
        });
      }
    }.bind(this));
  },

  render: function () {
    console.log(this);
    return (
      <div>
        <h1>Tile map</h1>
        <div>
          <ul>
            <li>Alias: {this.state.repo.Alias}</li>
            <li>UUID: {this.state.uuid}</li>
            <li>Created: {this.state.repo.Created}</li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = TileMap;
