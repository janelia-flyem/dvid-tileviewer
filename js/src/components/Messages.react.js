var React = require('react');

var Messages = React.createClass({
  render: function() {

    if (!this.props.message) {
      return null;
    }

    var message_class = "alert alert-";

    message_class += this.props.message.type;

    return (
      <div className={message_class} role="alert">{this.props.message.text}</div>
    );
  }
});

module.exports = Messages;
