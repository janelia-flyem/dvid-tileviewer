var React       = require('react'),
  Router        = require('react-router'),
  Route         = Router.Route,
  NotFoundRoute = Router.NotFoundRoute,
  DefaultRoute  = Router.DefaultRoute,
  Link          = Router.Link,
  RouteHandler  = Router.RouteHandler,
  TileMap       = require('./TileMap.react'),
  Home          = require('./Home.react'),
  NotFound      = require('./NotFound.react'),
  Nav           = require('./Navigation.react');

var TileViewerApp = React.createClass({
  render: function () {
    return (
      <div>
        <Nav />

        <div className="container-fluid">
          {/* this is the important part for route handling */}
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="tileviewerapp" path="/" handler={TileViewerApp}>
    <Route name="uuid" path="uuid/:uuid" handler={TileMap}/>
    <DefaultRoute handler={Home}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = TileViewerApp;
