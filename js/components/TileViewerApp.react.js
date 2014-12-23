var React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  NotFoundRoute = Router.NotFoundRoute,
  DefaultRoute = Router.DefaultRoute,
  Link = Router.Link,
  RouteHandler = Router.RouteHandler,
  TileMap = require('./TileMap.react');
  Home = require('./Home.react');

var TileViewerApp = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="tileviewerapp">Home</Link></li>
          </ul>
        </header>

        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});



var routes = (
  <Route name="tileviewerapp" path="/" handler={TileViewerApp}>
    <Route name="uuid" path="uuid/:uuid" handler={TileMap}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = TileViewerApp;
