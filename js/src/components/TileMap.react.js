var React = require('react'),
  Router = require('react-router'),
  TileMapArea = require('./TileMapArea.react'),
  DataInstances = require('./DataInstances.react'),
  config = require('../common/config');

var TileMap = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      plane: this.getParams().plane,
      coordinateString: this.getParams().coordinates,
      repo: {
        DataInstances: {}
      }
    };
  },

  componentWillReceiveProps: function (props) {
    var self = this;
    this.setState({
      plane: this.getParams().plane,
      coordinateString: this.getParams().coordinates
    });

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
        <div className="row info-header">
          <div className="col-sm-6">
            <h1>{this.state.repo.Alias}</h1>
            <p>{this.state.repo.Description}</p>
          </div>
          <div className="col-sm-6 text-right">
            <p><b>UUID:</b> {this.state.uuid}</p>
            <p><b>Created:</b> {dateString(this.state.repo.Created)}</p>
            <p><b>Updated:</b> {dateString(this.state.repo.Updated)}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <p>Data Instances</p>
            <DataInstances instances={this.state.repo.DataInstances} uuid={this.state.uuid}/>
          </div>
          <div className="col-sm-8">
            <TileMapArea instances={this.state.repo.DataInstances} uuid={this.state.uuid} coordinateString={this.state.coordinateString} plane={this.state.plane}/>
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
