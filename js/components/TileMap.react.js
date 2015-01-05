var React = require('react'),
  Router = require('react-router');

var TileMap = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      repo: {}
    };
  },

  componentDidMount: function () {
    var uri = 'http://localhost:8000/api/repo/' + this.state.uuid  + '/info';
    $.get(uri, function(result) {
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
        <div>{this.state.uuid} - {this.state.repo['Created']}</div>
      </div>
    );
  }
});

module.exports = TileMap;
