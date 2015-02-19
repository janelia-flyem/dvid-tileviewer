var React  = require('react'),
  Router   = require('react-router'),
  config   = require('../common/config'),
  core     = require('../common/core'),
  dataname = config.settings.datatype,
  infotype = config.settings.infotype,
  TileCoordinates = require('./TileCoordinates.react'),
  slice1    = 'xy',
  slice2    = 'xz',
  slice3    = 'yz',
  viewer   = null;
  img_helper = null;

var TileMapArea = React.createClass({

  getInitialState: function() {
    return {
      x: 0,
      y: 0,
      z: 0,
      layer: 0,
      plane: 0,
      segmentation: false
    };
  },

  componentWillReceiveProps: function (props) {
    var self = this;

    if (props.instances && props.instances[dataname]) {
      var node = this.getDOMNode();
      var uuid = this.props.uuid;
      // set the variables for the tile viewer based on data fetched from the server
      var url = config.baseUrl();

      $.when($.ajax(config.datatypeInfoUrl(uuid, dataname)), $.ajax(config.datatypeInfoUrl(uuid, infotype)))
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

          // this works out the size of the image based on the number of tiles required
          // to cover the complete image at the largest level.
          //
          //Notes from Bill.
          //
          //Say we have 500x500 tiles but our real volume size is 6133 x 7000 x 8000.
          //In order to cover the real volume size, we have 5 scales.
          //
          //Scale 0 = no downres, so we have 6133/500 = 13 tiles along X to cover real X extent.
          //Scale 1 = 2x, so we have 3067/500 = 7 tiles along X to cover the downres X extent
          //Scale 2 = 4x, it’s now 1534/500 = 4 tiles
          //Scale 3 = 8x, it’s now 717/500 = 2 tiles
          //Scale 4 = 16x, one tile
          //
          //But this means to OpenSeadragon, the “tiled” X extent is really 500 x 16 = 8000 voxels.
          //This will lead to a lot of empty padding at end of x, y, and z, but shouldn’t affect
          //your offsets I believe.
          //

          var maxDimensions = 512 * Math.pow(2, maxLevel);

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
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice1]-1,
              getTileUrl: function xyTileURL(level, x, y, z) {
                //var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                var api_url = config.tileFetchUrl(uuid, maxLevel - level, slice1, x, y, z);
                return api_url;
              }
            },
            {
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice2]-1,
              getTileUrl: function xzTileURL(level, x, y, z) {
                //var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice2 + "/512_512/" + (x * 512) + "_" + z + "_" + (y * 512) + "/jpg:80";
                var api_url = config.tileFetchUrl(uuid, maxLevel - level, slice2, x, z, y);
                return api_url;
              }
            },
            {
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice3]-1,
              getTileUrl: function yzTileURL(level, x, y, z) {
                //var api_url = url + "/api/node/" + uuid + "/" + dataname + "/raw/" + slice3 + "/512_512/" + z + "_" + (x * 512) + "_" + (y * 512) + "/jpg:80";
                var api_url = config.tileFetchUrl(uuid, maxLevel - level, slice3, z, x, y);
                return api_url;
              }
            },
            // composite for xy plane
            {
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice1]-1,
              getTileUrl: function xyTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/bodyview/raw/" + slice1 + "/512_512/" + (x * 512) + "_" + (y * 512) + "_" + z + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice2]-1,
              getTileUrl: function xzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/bodyview/raw/" + slice2 + "/512_512/" + (x * 512) + "_" + z + "_" + (y * 512) + "/jpg:80";
                return api_url;
              }
            },
            {
              height:    maxDimensions,
              width:     maxDimensions,
              tileSize:  tileSize,
              minLevel:  0,
              maxLevel:  maxLevel,
              minZ:      0,
              maxZ:      volumeDepth[slice3]-1,
              getTileUrl: function yzTileURL(level, x, y, z) {
                var api_url = url + "/api/node/" + uuid + "/bodyview/raw/" + slice3 + "/512_512/" + z + "_" + (x * 512) + "_" + (y * 512) + "/jpg:80";
                // for use when we have the tiles working
                //var api_url = url + "/api/node/" + uuid + "/" + dataname + "/tile/" + slice3 + "/" + (maxLevel-level) + "/" + x + "_" + y + "_" + z;
                return api_url;
              }
            },
            ]
          };
          viewer.xy = OpenSeadragon({
            // need to be able to pass in the react state, so that we can modify it
            // when using the other buttons to change z layer.
            id:                 "viewer",
            prefixUrl:          "js/vendor/openseadragon/images/",
            navigatorSizeRatio: 0.25,
            wrapHorizontal:     false,
            maxZoomPixelRatio:  1.8,
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
            /*gestureSettingsMouse: {
              clickToZoom: false
            },*/
            debugMode:          false
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
            var center = event.viewportCenter,
              x = Math.round(img_helper.logicalToDataX(center.x)),
              y = Math.round(img_helper.logicalToDataY(center.y));
            self.setState({'x': x, 'y': y});
          });

          viewer.xy.addHandler('canvas-click', function(event) {
            //console.log(img_helper.physicalToDataPoint(event.position));
          });


          viewer.recenter = false;

          viewer.xy.addHandler('page', function(event) {
            var choice = parseInt($('.cut_plane').val());
            var coordinates = img_helper.logicalToDataPoint(img_helper._viewportCenter);
            coordinates.z = Math.round($('#depth').val());


            // need to move the image to the correct coordinates in the viewer?
            var converted = convertCoordinates({coordinates: coordinates, from: self.state.plane, to: choice});
            var z = Math.round(converted.z);

            // save this information to be used later in the open event handler,
            // when the image has finished updating and we can scroll to the correct
            // location.
            viewer.recenter = {
              from: self.state.plane,
              to: choice,
              coordinates: converted
            };


            self.setState({layer: z});
            self.setState({plane: choice});



          });

          // we have to have the center function triggered in the open event, because
          // it fires off too soon in the page event and the image width is incorrect.
          // This causes it to center in the wrong location.
          viewer.xy.addHandler('open', function(event) {

            if (viewer.recenter) {

              var logicalPoint = img_helper.dataToLogicalPoint(viewer.recenter.coordinates);
              img_helper.centerAboutLogicalPoint(logicalPoint, true);
            }

            viewer.recenter = false;

            // make sure the layer is updated after the page change and open event has been fired.
            // had to move this after the open event, because the navigator wasn't fully loaded before
            var z = Math.round($('#depth').val());
            self.handleLayerChange(z);
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

  //simply delegates to the updateViewerPlane() function. I would
  //bypass this entirely, but it seems to have strange consequences
  //on the state object.
  handlePlaneChange: function(event) {
    this.updateViewerPlane();
  },

  handleSegmentation: function (event) {
    var currentSeg = this.state.segmentation;
    this.setState({segmentation: !currentSeg});
    this.updateViewerPlane(!currentSeg);
  },

  updateViewerPlane: function (currentSeg) {
    if (typeof currentSeg == 'undefined') {
      currentSeg = this.state.segmentation;
    }
    // convert the value to an integer for later lookups
    var choice = parseInt(this.refs.cutPlane.getDOMNode().value, 10);

    // if segmentation should be on, then use the correct tileSource by adding
    // 3, so that we skip to the segmentation tile sources.
    if (currentSeg) {
      choice += 3;
    }

    // update the tile viewer display.
    viewer.xy.goToPage(choice);
    // update the slider to reflect the new depth, which can be found in the viewer
    // object.
    var depth = viewer.tileSources[choice].maxZ;
    $('#depth').attr('max', depth);
    $('#stack-slider').attr('max', depth);

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

    // need to figure out what plane we are in and change the XYZ labels accordingly.
    //

    var inputOne   = React.createElement('input',{'id': 'horizontal', 'type': 'number', 'min': 0, 'ref': 'horizontal'});
    var inputTwo   = React.createElement('input',{'id': 'vertical', 'type': 'number', 'min': 0, 'ref': 'vertical'});
    var inputThree = React.createElement('input',{'id': 'depth', 'type': 'number', 'min': 0, 'ref': 'depth'});

    if (this.state.plane === 1) {
      inputOne   = React.createElement('input',{'id': 'horizontal', 'type': 'number', 'min': 0, 'ref': 'horizontal'});
      inputTwo   = React.createElement('input',{'id': 'depth', 'type': 'number', 'min': 0, 'ref': 'depth'});
      inputThree = React.createElement('input',{'id': 'vertical', 'type': 'number', 'min': 0, 'ref': 'vertical'});
    }
    else if (this.state.plane === 2) {
      inputOne   = React.createElement('input',{'id': 'depth', 'type': 'number', 'min': 0, 'ref': 'depth'});
      inputTwo   = React.createElement('input',{'id': 'horizontal', 'type': 'number', 'min': 0, 'ref': 'horizontal'});
      inputThree = React.createElement('input',{'id': 'vertical', 'type': 'number', 'min': 0, 'ref': 'vertical'});
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
                <button type="button" className="btn btn-default hidden" id="toggle-overlay">overlay</button>
                <button type="button" className="btn btn-default" id="toggle-composite" onClick={this.handleSegmentation}>Segmentation</button>
                <select value={this.state.plane} className="form-control cut_plane" ref="cutPlane" onChange={this.handlePlaneChange}>
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
                <label>x</label>{inputOne}
                <label>y</label>{inputTwo}
                <label>z</label>{inputThree}
                <button type="submit" id="coordinatechange">Go</button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
            <TileCoordinates width={this.state.x} height={this.state.y} depth={this.state.layer} plane={this.state.plane}/>
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
  var converted = null;
  switch (to) {
    case 1:// xz okay
      converted = new OpenSeadragon.Point(coordinates.x, coordinates.z);
      converted.z = coordinates.y;
      break;
    case 2:// yz okay
      converted = new OpenSeadragon.Point(coordinates.y, coordinates.z);
      converted.z = coordinates.x;
      break;
    default:
      converted = coordinates;
  }
  return converted;
};

function convertFromXZ(coordinates, to) {
  var converted = null;
  switch (to) {
    case 0:// xy okay
      converted = new OpenSeadragon.Point(coordinates.x, coordinates.z);
      converted.z = coordinates.y;
      break;
    case 2:// yz okay
      converted = new OpenSeadragon.Point(coordinates.z, coordinates.y);
      converted.z = coordinates.x;
      break;
    default:
      converted = coordinates;
  }
  return converted;
};
function convertFromYZ(coordinates, to) {
  var converted = null;
  switch (to) {
    case 0:// xy okay
      converted = new OpenSeadragon.Point(coordinates.z, coordinates.x);
      converted.z = coordinates.y;
      break;
    case 1:// xz okay
      converted = new OpenSeadragon.Point(coordinates.z, coordinates.y);
      converted.z = coordinates.x;
      break;
    default:
      converted = coordinates;
  }
  return converted;
};

