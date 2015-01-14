var React  = require('react'),
  Router   = require('react-router'),
  config   = require('../common/config'),
  dataname = 'graytiles',
  slice    = 'xy',
  viewer   = null;

var TileMapArea = React.createClass({

  getInitialState: function() {
    return {layer: 0};
  },

  componentDidMount: function () {
    var node = this.getDOMNode();
    var uuid = this.props.uuid;
    // set the variables for the tile viewer based on data fetched from the server
    var url = config.baseUrl();

    $.when($.ajax(config.datatypeInfoUrl(uuid, dataname)), $.ajax(config.datatypeInfoUrl(uuid, 'grayscale')))
      .done(function(tileRequest, grayscaleRequest) {
        var tileData = tileRequest[0],
          gScaleData = grayscaleRequest[0],
          maxPoint   = gScaleData.Extended.MaxPoint,
          minPoint   = gScaleData.Extended.MinPoint,
          dx        = maxPoint[0] - minPoint[0],
          dy        = maxPoint[1] - minPoint[1],
          dz        = maxPoint[2] - minPoint[2];

        var maxLevel = Object.keys(tileData.Extended.Levels).length - 1;

        var volumeWidth = {
          'xy': dx,
          'xz': dx,
          'yz': dy,
        };

        var volumeHeight = {
          'xy':  dy,
          'xz':  dz,
          'yz':  dz
        };

        var volumeDepth = {
          'xy':  dz,
          'xz':  dy,
          'yz':  dx
        };

        $('#stack-slider').attr('max', dz).change(function() {
          $('#z-layer').val($(this).val());
        });

        viewer = {
          nmPerPixel: 10,
          tileSource: {
            height:    volumeHeight[slice],
            width:     volumeWidth[slice],
            tileSize:  tileData.Extended.Levels[0].TileSize[0],
            minLevel:  0,
            maxLevel:  maxLevel,
            minZ:      0,
            maxZ:      volumeDepth[slice]-1,
            // getTileAtPoint: function(level, point) { Add offset to compute tiles }
            getTileUrl: function xyTileURL(level, x, y, z) {
              return url + "/api/node/" + uuid + "/" + dataname + "/tile/" + slice + "/" + (maxLevel-level) + "/" + x + "_" + y + "_" + z;
            }
          }
        };
        viewer.xy = OpenSeadragon({
          id:                 "viewer",
          prefixUrl:          "/js/openseadragon/images/",
          navigatorSizeRatio: 0.25,
          wrapHorizontal:     false,
          maxZoomPixelRatio:  5.0,
          showNavigator:      true,
          tileSources:        viewer.tileSource,
          //zoomPerClick:       1.0,
          toolbar:            "toolbar",
          zoomInButton:       "zoom-in",
          zoomOutButton:      "zoom-out",
          homeButton:         "home",
          fullPageButton:     "full-page",
          debugMode:          true
        });
        viewer.xy.scalebar({
          pixelsPerMeter: 1000000000/viewer.nmPerPixel,
          fontColor:      "yellow",
          color:          "yellow"
        });

        window.viewer = viewer;

      });
  },

  componentWillUnmount: function() {
    if (viewer && viewer.xy) {
      viewer.xy.destroy();
      viewer.xy = null;
      viewer = null;
    }
  },

  componentDidUpdate: function() {
    if (viewer.xy && viewer.xy.viewport) {
      viewer.xy.viewport.z = this.state.layer;
    }
  },

  handleZChange: function(event) {
    this.setState({layer: event.target.value});
  },

  render: function() {
    return (
        <div>
          <div id="toolbar">
            <button type="button" className="btn btn-default" id="home">Home</button>
            <button type="button" className="btn btn-default" id="zoom-in">Down Z Layer</button>
            <button type="button" className="btn btn-default" id="zoom-out">Up Z Layer</button>
            <button type="button" className="btn btn-default" id="full-page">Full Page</button>
            <form>
              <input id="stack-slider" min="0" max="1000" type="range" value={this.state.layer} onChange={this.handleZChange}/>
              <input id="z-layer" type="text" value={this.state.layer} onChange={this.handleZChange}/>
            </form>
          </div>
          <div id="viewer" className="openseadragon"></div>
        </div>
    );
  }
});

module.exports = TileMapArea;
