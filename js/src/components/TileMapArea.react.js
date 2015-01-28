var React  = require('react'),
  Router   = require('react-router'),
  config   = require('../common/config'),
  core     = require('../common/core'),
  dataname = 'graytiles',
  slice1    = 'xy',
  slice2    = 'xz',
  slice3    = 'yz',
  viewer   = null;

var TileMapArea = React.createClass({

  getInitialState: function() {
    return {layer: 0};
  },

  componentWillReceiveProps: function (props) {
    if (props.instances && props.instances.graytiles) {
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
            $('#depth').val($(this).val());
          });

          $('#depth').attr('max', dz);

          viewer = {
            nmPerPixel: 10,
            tileSources: [
            {
              height:    volumeHeight[slice1],
              width:     volumeWidth[slice1],
              tileSize:  tileData.Extended.Levels[0].TileSize[0],
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice1]-1,
              // getTileAtPoint: function(level, point) { Add offset to compute tiles }
              getTileUrl: function xyTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/grayscale/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    volumeHeight[slice2],
              width:     volumeWidth[slice2],
              tileSize:  tileData.Extended.Levels[0].TileSize[0],
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice2]-1,
              getTileUrl: function xzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/grayscale/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    volumeHeight[slice3],
              width:     volumeWidth[slice3],
              tileSize:  tileData.Extended.Levels[0].TileSize[0],
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice3]-1,
              getTileUrl: function yzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/grayscale/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                return api_url;
              }
            }
            ]
          };
          viewer.xy = OpenSeadragon({
            // need to be able to pass in the react state, so that we can modify it
            // when using the other buttons to change z layer.
            id:                 "viewer",
            prefixUrl:          "/js/openseadragon/images/",
            navigatorSizeRatio: 0.25,
            wrapHorizontal:     false,
            maxZoomPixelRatio:  5.0,
            showNavigator:      true,
            tileSources:        viewer.tileSources,
            //zoomPerClick:       1.0,
            toolbar:            "toolbar",
            zoomInButton:       "zoom-in",
            zoomOutButton:      "zoom-out",
            homeButton:         "home",
            previousButton:     "previous",
            nextButton:         "next",
            fullPageButton:     "full-page",
            immediateRender:    true,
            debugMode:          true
          });
          viewer.xy.scalebar({
            pixelsPerMeter: 1000000000/viewer.nmPerPixel,
            fontColor:      "yellow",
            color:          "yellow"
          });

          window.viewer = viewer;

        });
    }
  },

  componentWillUnmount: function() {
    if (viewer && viewer.xy) {
      viewer.xy.destroy();
      viewer.xy = null;
      viewer = null;
    }
  },

  componentDidUpdate: function() {

  },

  handleLayerChange: function(layer) {
    if (viewer.xy && viewer.xy.viewport) {
      viewer.xy.updateLayer(layer);
    }
  },

  handleZChange: core.throttle(function(event) {
    if (event.target) {
      this.setState({layer: event.target.value});
      this.handleLayerChange(event.target.value);
    }
  }, 250),

  handleZKeyDown: function (event) {
    // event fired when the z input is focused and a key is pressed.
  },

  handleZKeyUp: function(event) {
    // need to keep this here or the input number and the layer get out of sync
    // when throttling.
    this.handleLayerChange(event.target.value);
  },

  handlePlaneChange: function(event) {
    // update the tile viewer display.
    viewer.xy.goToPage(event.target.value);
    // update the slider to reflect the new depth.
    $('#depth').attr('max', 1000);
    $('#stack-slider').attr('max', 1000);
  },

  render: function() {

    if (!this.props.instances || !this.props.instances.graytiles ) {
      return (
        <div className="data-missing">
          <h3>Tile data not available</h3>
          <p className="subtle">Help on how to generate tile data can be found <a href="">here</a>.</p>
        </div>
      );
    }

    return (
        <div>
          <div id="toolbar">
            <div className="row">
            <form className="form-inline">
              <div className="col-sm-12">
                <button type="button" className="btn btn-default" id="home">Home</button>
                <button type="button" className="btn btn-default" id="zoom-in">Zoom In</button>
                <button type="button" className="btn btn-default" id="zoom-out">Zoom Out</button>
                <button type="button" className="btn btn-default" id="full-page">Full Screen</button>
                <select className="form-control cut_plane" onChange={this.handlePlaneChange}>
                  <option value="0">xy</option>
                  <option value="1">xz</option>
                  <option value="2">yz</option>
                </select>
              </div>
            </form>
            </div>
            <div className="row">
              <div className="col-sm-1" id="stack-input">
                <input id="depth" type="number" min="0" max="2000" value={this.state.layer} onChange={this.handleZChange} onKeyDown={this.handleZKeyDown} onKeyUp={this.handleZKeyUp}/>
              </div>
              <div className="col-sm-11" id="slider-container">
                <input id="stack-slider" min="0" max="2000" type="range" value={this.state.layer} onChange={this.handleZChange} onKeyDown={this.handleZKeyDown} onKeyUp={this.handleZKeyUp}/>
              </div>
            </div>
          </div>
          <div id="viewer" className="openseadragon"></div>
        </div>
    );
  }
});

module.exports = TileMapArea;

