var React  = require('react'),
  Router   = require('react-router'),
  config   = require('../common/config'),
  dataname = 'graytiles',
  slice    = 'xy',
  viewer   = null;

var TileMapArea = React.createClass({

  componentDidUpdate: function () {
    if (this.props.instances.hasOwnProperty(dataname)) {
      var uuid = this.props.uuid;
      // set the variables for the tile viewer based on data fetched from the server
      var url = config.baseUrl();

      $.get(config.datatypeInfoUrl(uuid, dataname), function (data) {
        console.log(data);
        var maxLevel = Object.keys(data.Extended.Levels).length - 1;
        var volumeWidth = {
            'xy': 6445,
            'xz': 6445,
            'yz': 6642
        };
        var volumeHeight = {
            'xy': 6642,
            'xz': 8089,
            'yz': 8089
        }
        var volumeDepth = {
            'xy': 8089,
            'xz': 6642,
            'yz': 6445
        }

        viewer = {
          nmPerPixel: 10,
          tileSource: {
            height:    volumeHeight[slice],
            width:     volumeWidth[slice],
            tileSize:  data.Extended.Levels[0].TileSize[0],
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
          tileSources:        viewer.tileSource
        });
        viewer.xy.scalebar({
          pixelsPerMeter: 1000000000/viewer.nmPerPixel,
          fontColor:      "yellow",
          color:          "yellow"
        });
      });
    }
  },

  componentWillUnmount: function() {
    console.log(viewer);
    if (viewer && viewer.xy) {
      viewer.xy.destroy();
      viewer = null;
    }
  },

  render: function() {
    if (this.props.instances.hasOwnProperty(dataname)) {
      return (
          <div>
            <div id="viewer" className="openseadragon"></div>
          </div>
      );
    }
    else {
      return (
          <p>no graytiles data set.</p>
      );
    }
  }
});

module.exports = TileMapArea;
