var React = require('react'),
  Router = require('react-router'),
  config = require('../common/config');
  Link   = Router.Link;

var Home = React.createClass({
  getInitialState: function() {
    return {
      uuids: [],
    };
  },

  // this gets called after the fist time the component is loaded into the page.
  componentDidMount: function () {
    $.get(config.reposInfoUrl(), function(result) {
      var repos = result;
      if (this.isMounted()) {
        var repolist = [];
        for (var repo in repos) {
          console.log(repos);
          if (repos.hasOwnProperty(repo)) {
            repolist.push({key: repo, uuid: repo, alias: repos[repo].Alias, desc: repos[repo].Description, dag: repos[repo].DAG});
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
        <h1>Repositories</h1>
        <UUIDList items={this.state.uuids}/>
      </div>
    );
  }
});

var ItemWrapper = React.createClass({
  getInitialState: function() {
    return {
      visible: true
    };
  },

  handleClick: function(event) {
    this.setState({visible: !this.state.visible});
  },

  render: function() {
    console.log(this.state);
    return (
      <li>
        <Link to="dataselection" params={{uuid: this.props.data.uuid}}>{this.props.data.alias ? this.props.data.alias : 'Unnamed Repo' }</Link> - {this.props.data.desc ? this.props.data.desc : 'no description'}
        <p className="subtle" onClick={this.handleClick}>{this.props.data.uuid}</p>
        <p className={ this.state.visible ? 'show' : 'hidden'}>DAG</p>
      </li>
    );
  }
});

var UUIDList = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.items.map(function(object) {
           return <ItemWrapper data={object} key={object.key}/>;
        })}
      </ul>
    );
  }
});

module.exports = Home;
