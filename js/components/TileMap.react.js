var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config');

var TileMap = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      repo: {
        DataInstances: {}
      }
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
    return (
      <div>
        <h1>Tile map</h1>
        <div>
          <ul>
            <li>Alias: {this.state.repo.Alias}</li>
            <li>UUID: {this.state.uuid}</li>
            <li>Created: {this.state.repo.Created}</li>
            <li>Data Instances
            <DataInstances instances={this.state.repo.DataInstances} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = TileMap;

var DataInstances = React.createClass({
  render: function() {
    var instanceList = Object.keys(this.props.instances).map(function(data, i) {
      return (
        <li key={"instance-" + i}>{data}</li>
      );
    });

    return (
      <ul>
      {instanceList}
      </ul>
    );
  }
});

