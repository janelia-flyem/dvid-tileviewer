var React = require('react'),
  Router = require('react-router'),
  Link   = Router.Link;

var Home = React.createClass({
  getInitialState: function() {
    return {
      uuids: [
        '134c8f09429311e4a83dc81f66eb987e',
        '2b6c789448c911e4ad8cc81f66eb987e'
      ],
      text: 'UUID list'
    };
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
