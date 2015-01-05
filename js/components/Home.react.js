var React = require('react'),
  Router = require('react-router'),
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
    $.get('http://localhost:8000/api/repos/info', function(result) {
      var repos = result;
      console.log(repos);
      if (this.isMounted()) {
        var repolist = [];
        for (var repo in repos) {
          if (repos.hasOwnProperty(repo)) {
            repolist.push(repo);
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
      <li><Link to="tilemap" params={{uuid: this.props.data}}>{this.props.data}</Link></li>
    );
  }
});

var UUIDList = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.items.map(function(object) {
           return <ItemWrapper key={object} data={object}/>;
        })}
      </ul>
    );
  }
});

module.exports = Home;
