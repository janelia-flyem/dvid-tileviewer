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
    //console.log(this.props.data.dag);
    var nodes = [];
    for (var node in this.props.data.dag.Nodes) {
      nodes.push(this.props.data.dag.Nodes[node]);
    }

    return (
      <li>
        <p onClick={this.handleClick}>{this.props.data.alias ? this.props.data.alias : 'Unnamed Repo' } - {this.props.data.desc ? this.props.data.desc : 'no description'}</p>
        <div className={ this.state.visible ? 'show' : 'hidden'}>
          {nodes.map(function(node) {
            return <NodeWrapper data={node} key={node.UUID}/>;
          })}
        </div>
      </li>
    );
  }
});


var NodeWrapper = React.createClass({
  render: function () {
    return (
      <p><Link to="dataselection" params={{uuid: this.props.data.UUID}}>{this.props.data.UUID}</Link> ({this.props.data.VersionID}) - {this.props.data.Note}</p>
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
