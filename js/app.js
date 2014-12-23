var React = require('react'),
 Router = require('react-router'),
 Route = Router.Route,
 NotFoundRoute = Router.NotFoundRoute,
 DefaultRoute = Router.DefaultRoute,
 Link = Router.Link,
 RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="app">Home</Link></li>
          </ul>
        </header>

        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});

var TileMap = React.createClass({
  mixins: [Router.State],
  render: function () {
    return (
      <div>
        <h1>Tile map</h1>
        <div>{this.getParams().uuid}</div>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div>Home</div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="uuid" path="uuid/:uuid" handler={TileMap}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
