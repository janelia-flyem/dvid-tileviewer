var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config');
  Link   = Router.Link;

var Home = React.createClass({
  getInitialState: function() {
    return {
      uuids: [],
      text: 'UUID list'
    };
  },

  // this gets called after the fist time the component is loaded into the page.
  componentDidMount: function () {
    $.get(config.reposInfoUrl(), function(result) {
      var repos = result;
      if (this.isMounted()) {
        var repolist = [];
        for (var repo in repos) {
          if (repos.hasOwnProperty(repo)) {
            repolist.push({key: repo, uuid: repo, alias: repos[repo].Alias});
          }
        }
        this.setState({
          uuids: repolist
        });
      }
    }.bind(this));
  },

  render: function () {
    return (
      <div>
        <h1>Home</h1>
        <p>{this.state.text}</p>
        <UUIDList items={this.state.uuids}/>
      </div>
    );
  }
});

var ItemWrapper = React.createClass({
  render: function() {
    return (
      <li><Link to="tilemap" params={{uuid: this.props.data.uuid}}>{this.props.data.alias}</Link> - {this.props.data.uuid} </li>
    );
  }
});

var UUIDList = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.items.map(function(object) {
           return <ItemWrapper data={object}/>;
        })}
      </ul>
    );
  }
});

module.exports = Home;
