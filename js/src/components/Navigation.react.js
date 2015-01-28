var React = require('react'),
  Router = require('react-router'),
  Link   = Router.Link;

var Navigation = React.createClass({
  mixins: [Router.State],
  render: function () {
    return (
<nav className="navbar navbar-default">
  <div className="container-fluid">
    <div className="navbar-header">
      <Link to="tileviewerapp" className="navbar-brand">DVID</Link>
    </div>
  </div>
</nav>
    );
  }
});

module.exports = Navigation;
