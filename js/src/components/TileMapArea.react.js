var React  = require('react'),
  Router   = require('react-router'),
  config   = require('../common/config'),
  core     = require('../common/core'),
  dataname = config.settings.datatype,
  slice1    = 'xy',
  slice2    = 'xz',
  slice3    = 'yz',
  viewer   = null;
  img_helper = null;

var TileMapArea = React.createClass({

  getInitialState: function() {
    return {coordinates: { x: 0, y: 0, z: 0}, layer: 0, plane: 0};
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

          // set a default level of one unless we actually have tiling information
          var maxLevel = 4;
          if (tileData.Extended && tileData.Extended.Levels) {
            maxLevel = Object.keys(tileData.Extended.Levels).length - 1;
          }

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

          var tileSize = 512;
          if (tileData.Extended && tileData.Extended.Levels) {
            tileSize = tileData.Extended.Levels[0].TileSize[0];
          }

          viewer = {
            nmPerPixel: 10,
            tileSources: [
            {
              height:    volumeHeight[slice1],
              width:     volumeWidth[slice1],
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice1]-1,
              getTileUrl: function xyTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    volumeHeight[slice2],
              width:     volumeWidth[slice2],
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice2]-1,
              getTileUrl: function xzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice2 + "/512_512/" + (x * 512) + "_" + z + "_" + (y * 512) + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    volumeHeight[slice3],
              width:     volumeWidth[slice3],
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice3]-1,
              getTileUrl: function yzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice3 + "/512_512/" + z + "_" + (x * 512) + "_" + (y * 512) + "/jpg:80";
                return api_url;
              }
            }
            ]
          };
          viewer.xy = OpenSeadragon({
            // need to be able to pass in the react state, so that we can modify it
            // when using the other buttons to change z layer.
            id:                 "viewer",
            prefixUrl:          "/js/vendor/openseadragon/images/",
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
            preserveViewport:   true,
            fullPageButton:     "full-page",
            //immediateRender:    true,
            debugMode:          true
          });
          viewer.xy.scalebar({
            pixelsPerMeter: 1000000000/viewer.nmPerPixel,
            fontColor:      "yellow",
            color:          "yellow"
          });

          window.viewer = viewer;
          img_helper = viewer.xy.activateImagingHelper();
          window.img_helper = img_helper;

          img_helper.addHandler('image-view-changed', function (event) {
            var center = event.viewportCenter;
            $('#displayX').html(Math.round(img_helper.logicalToDataX(center.x)));
            $('#displayY').html(Math.round(img_helper.logicalToDataY(center.y)));
          });

          viewer.xy.addHandler('page', function() {
            console.info('page changed');
          });

          var overlay = false;

          $("#toggle-overlay").click(function(e) {
              e.preventDefault();
              if (overlay) {
                  viewer.xy.removeOverlay("runtime-overlay");
              } else {
                  var elt = document.createElement("img");
                  elt.id = "runtime-overlay";
                  elt.className = "highlight";
                  elt.src = '/overlay.png'
                  viewer.xy.addOverlay({
                      element: elt,
                      // attempt to place the image in the correct location on the tile map.
                      // this seems to be off by between 50 - 100 pixels. Not production ready.
                      // must be some rounding errors in scale changes whilst zooming.
                      location: new OpenSeadragon.Rect(img_helper.dataToLogicalX(3400), img_helper.dataToLogicalY(3500), img_helper.dataToLogicalX(512), img_helper.dataToLogicalY(512))
                  });
              }
              overlay = !overlay;
          });

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

  handleCoordinateChange: function(event) {
    event.preventDefault();

    var x = parseInt(this.refs.horizontal.getDOMNode().value.trim(), 10);
    var y = parseInt(this.refs.vertical.getDOMNode().value.trim(), 10);
    var z = parseInt(this.refs.depth.getDOMNode().value.trim(), 10);

    var point = new OpenSeadragon.Point(x,y);
    var logical = img_helper.dataToLogicalPoint(point);

    //scroll to the point in the plane
    img_helper.centerAboutLogicalPoint(logical);

    // change the layer
    this.setState({layer: z});
    this.handleLayerChange(z);
    this.refs.horizontal.getDOMNode().value = '';
    this.refs.vertical.getDOMNode().value = '';
    this.refs.depth.getDOMNode().value = '';

  },

  handlePlaneChange: function(event) {
    // convert the value to an integer for later lookups
    var choice = parseInt(event.target.value, 10);

    // get required values before the change
    var zoomFactor  = img_helper.getZoomFactor();
    console.info(zoomFactor);
    // need to figure out which coordinate we are moving to and set the slider accordingly.
    var coordinates = img_helper.logicalToDataPoint(img_helper._viewportCenter);
    coordinates.z = Math.round($('#depth').val());

    // update the tile viewer display.
    viewer.xy.goToPage(choice);
    // update the slider to reflect the new depth, which can be found in the viewer
    // object.
    var depth = viewer.tileSources[choice].maxZ;
    $('#depth').attr('max', depth);
    $('#stack-slider').attr('max', depth);


    // coordinate conversion method here
    var converted = convertCoordinates({coordinates: coordinates, from: this.state.plane, to: choice});

    console.log(converted);

    var z = Math.round(converted.z);
    this.setState({layer: z});
    this.setState({plane: choice});

    this.handleLayerChange(z);
    // need to move the image to the correct coordinates how to do this via openseqdragon?
    img_helper.centerAboutLogicalPoint(img_helper.dataToLogicalPoint(converted), true);
    img_helper.setZoomFactor(zoomFactor, true);
  },

  render: function() {

    if (!this.props.instances || !this.props.instances.hasOwnProperty(dataname) ) {
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
                <button type="button" className="btn btn-default" id="toggle-overlay">overlay</button>
                <select value={this.state.plane} className="form-control cut_plane" onChange={this.handlePlaneChange}>
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
          <div className="row">
            <div className="col-sm-12">
              <form name="coordinates" onSubmit={this.handleCoordinateChange}>
                w<input id="horizontal" type="number" min="0" max="9999" ref="horizontal" />
                h<input id="vertical" type="number" min="0" max="9999" ref="vertical" />
                d<input id="depth" type="number" min="0" max="9999" ref="depth" />
                <button type="submit" id="coordinatechange">Go</button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <p>X: <span id="displayX"></span></p>
              <p>Y: <span id="displayY"></span></p>
              <p>Z: {this.state.layer} </p>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = TileMapArea;


function convertCoordinates (input) {
  var converted = null;
  switch (input.from) {
    case 0:// xy
      converted = convertFromXY(input.coordinates, input.to);
      break;
    case 1:// xz
      converted = convertFromXZ(input.coordinates, input.to);
      break;
    case 2:// yz
      converted = convertFromYZ(input.coordinates, input.to);
      break;
    default://
      converted = input.coordinates;
  }

  return converted;
};

function convertFromXY(coordinates, to) {
  console.log([coordinates.x, coordinates.y, coordinates.z]);
  var converted = null;
  switch (to) {
    case 1:// xz okay
      converted = new OpenSeadragon.Point(coordinates.x, coordinates.z);
      converted.z = coordinates.y;
      console.log([converted.x, converted.y, converted.z]);
      break;
    case 2:// yz okay
      converted = new OpenSeadragon.Point(coordinates.y, coordinates.z);
      converted.z = coordinates.x;
      console.log([converted.x, converted.y, converted.z]);
      break;
    default:
      converted = coordinates;
  }
  return converted;
};

function convertFromXZ(coordinates, to) {
  console.log([coordinates.x, coordinates.y, coordinates.z]);
  var converted = null;
  switch (to) {
    case 0:// xy okay
      converted = new OpenSeadragon.Point(coordinates.x, coordinates.z);
      converted.z = coordinates.y;
      console.log([converted.x, converted.y, converted.z]);
      break;
    case 2:// yz
      converted = new OpenSeadragon.Point(coordinates.z, coordinates.y);
      converted.z = coordinates.x;
      console.log([converted.x, converted.y, converted.z]);
      break;
    default:
      converted = coordinates;
  }
  return converted;
};
function convertFromYZ(coordinates, to) {
  console.log([coordinates.x, coordinates.y, coordinates.z]);
  var converted = null;
  switch (to) {
    case 0:// xy
      converted = new OpenSeadragon.Point(coordinates.z, coordinates.x);
      converted.z = coordinates.y;
      console.log([converted.x, converted.y, converted.z]);
      break;
    case 1:// xz
      converted = new OpenSeadragon.Point(coordinates.y, coordinates.x);
      converted.z = coordinates.z;
      console.log([converted.x, converted.y, converted.z]);
      break;
    default:
      converted = coordinates;
  }
  return converted;
};

