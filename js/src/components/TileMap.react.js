var React = require('react'),
  Router = require('react-router'),
  TileMapArea = require('./TileMapArea.react'),
  DataInstances = require('./DataInstances.react'),
  RepoHeader = require('./RepoHeader.react'),
  config = require('../common/config');

var TileMap = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      plane: this.getParams().plane,
      tileSource: this.getParams().tileSource,
      labelSource: this.getParams().labelSource,
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
        <RepoHeader repo={this.state.repo} uuid={this.state.uuid}/>
        <div className="row">
          <div className="col-sm-12">
            <TileMapArea instances={this.state.repo.DataInstances} uuid={this.state.uuid} coordinateString={this.state.coordinateString} plane={this.state.plane} tileSource={this.state.tileSource} labelSource={this.state.labelSource} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TileMap;
