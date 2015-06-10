var React       = require('react'),
  Router        = require('react-router'),
  Route         = Router.Route,
  NotFoundRoute = Router.NotFoundRoute,
  DefaultRoute  = Router.DefaultRoute,
  Link          = Router.Link,
  RouteHandler  = Router.RouteHandler,
  TileMap       = require('./TileMap.react'),
  DataSelection = require('./DataSelection.react'),
  Home          = require('./Home.react'),
  NotFound      = require('./NotFound.react'),
  Nav           = require('./Navigation.react'),
  dvid          = require('dvid'),
  config        = require('../common/config');

  dvid.connect({host: config.host, port: config.port});

var TileViewerApp = React.createClass({
  getInitialState: function () {
    return {
      dvid: dvid
    }
  },
  render: function () {
    return (
      <div>
        <Nav />

        <div className="container-fluid">
          {/* this is the important part for route handling */}
          <RouteHandler dvid={this.state.dvid}/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="tileviewerapp" path="/" handler={TileViewerApp}>
    <Route name="dataselection" path=":uuid" handler={DataSelection}/>
    <Route name="tilemap" path="uuid/:uuid/ts/:tileSource/ls/:labelSource" handler={TileMap}/>
    <Route name="tilemapwithcoords" path="uuid/:uuid/ts/:tileSource/ls/:labelSource/:plane/:coordinates" handler={TileMap}/>
    <DefaultRoute handler={Home}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = TileViewerApp;
