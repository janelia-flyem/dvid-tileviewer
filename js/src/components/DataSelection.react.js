var React = require('react'),
  Router = require('react-router'),
  DataInstances = require('./DataInstances.react'),
  config = require('../common/config');

var DataSelection = React.createClass({
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
        <p>Data Instances</p>
        <DataInstances instances={this.state.repo.DataInstances} uuid={this.state.uuid}/>
      </div>
    );
  }

});

module.exports = DataSelection;
