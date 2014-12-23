var React = require('react');

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

var UUIDList = React.createClass({
  render: function() {
    var renderItem = function(uuid) {
      return (
        <li>{uuid}</li>
      );
    };
    return (
      <ul>{this.props.items.map(renderItem)}</ul>
    );
  }
});

module.exports = Home;
