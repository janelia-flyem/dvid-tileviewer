var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config');
  Link   = Router.Link;

var Home = React.createClass({
  getInitialState: function() {
    return {
      uuids: [],
      text: 'Repositories'
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
            repolist.push({key: repo, uuid: repo, alias: repos[repo].Alias, desc: repos[repo].Description});
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
        <h1>{this.state.text}</h1>
        <UUIDList items={this.state.uuids}/>
      </div>
    );
  }
});

var ItemWrapper = React.createClass({
  render: function() {
    return (
      <li><Link to="tilemap" params={{uuid: this.props.data.uuid}}>{this.props.data.alias}</Link> - {this.props.data.desc}<p className="subtle">{this.props.data.uuid}</p></li>
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
