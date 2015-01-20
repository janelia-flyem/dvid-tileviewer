var React = require('react'),
  Router = require('react-router'),
  TileMapArea = require('./TileMapArea.react'),
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
        <div className="row">
          <div className="col-sm-6">
            <h1>{this.state.repo.Alias}<span className="uuid">{this.state.uuid}</span></h1>
          </div>
          <div className="col-sm-6 text-right">
            <p>Created: {dateString(this.state.repo.Created)}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <ul>
              <li>Data Instances
              <DataInstances instances={this.state.repo.DataInstances} />
              </li>
            </ul>
          </div>
          <div className="col-sm-10">
            <TileMapArea instances={this.state.repo.DataInstances} uuid={this.state.uuid}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TileMap;


var dateString = function (unformatted) {
  var date = new Date(unformatted);
  return date.toString();
}


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

