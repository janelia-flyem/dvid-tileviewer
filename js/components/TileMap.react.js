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
    console.log('initalize tileviewer code here');
  },

  componentWillUnmount: function() {
    console.log('stop tile viewer code');
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
        <div>
          <TileMapArea instances={this.state.repo.DataInstances}/>
        </div>
      </div>
    );
  }
});

module.exports = TileMap;

var TileMapArea = React.createClass({
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

