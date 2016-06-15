L.Map.ZKeyboard = L.Map.Keyboard.extend({
	_onKeyDown: function (e) {
		var key = e.keyCode,
		    map = this._map;
    if (key == 81) {// q key
      map.fireEvent('layerchange', {layer: map.current_z - 1});
    }
    else if (key == 69) { // e key
      map.fireEvent('layerchange', {layer: map.current_z + 1});
    }
  }
});

L.Map.addInitHook('addHandler', 'keyboard', L.Map.ZKeyboard);

L.Map.AltKeyboard = L.Map.Keyboard.extend({

	keyCodes: {
		left:    [65],
		right:   [68],
		down:    [83],
		up:      [87],
		zoomIn:  [],
		zoomOut: []
  },

	_onKeyDown: function (e) {
		var key = e.keyCode,
		    map = this._map;

		if (key in this._panKeys) {

			if (map._panAnim && map._panAnim._inProgress) { return; }

			map.panBy(this._panKeys[key]);

			if (map.options.maxBounds) {
				map.panInsideBounds(map.options.maxBounds);
			}

		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + this._zoomKeys[key]);

		} else {
			return;
		}

		L.DomEvent.stop(e);
	}
});

L.Map.addInitHook('addHandler', 'keyboard', L.Map.AltKeyboard);


var TileViewer = function(opts) {
  // set the default values here.
  this.options = {
    id: 'map',
    minZoom: 0,
    segSource: null,
    tileSource: null,
    rawSegSource: null,
    rawImages: false // are we using tile images or raw grayscale data? set to true for raw grayscale.
  };

  this.segmentation = [false, false];

  this._layers = [];

  this.createLayers = function () {
    var opts = this.options;
    // This loop generates the double tile layer used to view the gray tiles.
    for (var $i = 0; $i < 2 ;$i++) {
      var canvaslayer = new L.TileLayer.Canvas({
        async: true,
        //zoomReverse: true,
        maxNativeZoom: opts.maxZoom,
        maxZoom: opts.maxZoom,
        minZoom: opts.minZoom,
        tileSize: opts.tileSize,
        continuousWorld: true,
        noWrap: true
      });
      canvaslayer.drawTile = function(canvas, tilePoint, zoom) {
        var self = this;
        var converted_zoom = this.options.maxNativeZoom - zoom;
        if (converted_zoom < 0){
          converted_zoom = 0;
        }
        var ctx = canvas.getContext('2d');

        var x = tilePoint.x;
        var y = tilePoint.y;

        if (opts.rawImages) {
          x = x * opts.tileSize;
          y = y * opts.tileSize;
        }

        var url = opts.tileSource
          .replace(/{tile}/g, opts.tileSize)
          .replace('{x}', x)
          .replace('{y}', y)
          .replace('{zoom}', converted_zoom)
          .replace('{z}', opts.current_z );
        var img = new Image();
        img.addEventListener('load', function() {
          ctx.drawImage(img,0,0);
          self.tileDrawn(canvas);
        });
        img.src = url;
      }

      // have to override the redraw function as it will try to draw the tiles
      // twice
      canvaslayer.redraw = function () {
        if (this._map) {
          this._reset({hard: true});
          this._update();
        }

        return this;
      };

      this._layers.push(canvaslayer);
      //tile_layers.push(canvaslayer);
    }
  };

  this.createSegmentationLayers = function() {
    var tvOpts = this.options;

    var pseudoseg = new L.TileLayer.Canvas({
      async: true,
      maxNativeZoom: this.options.maxZoom,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.maxZoom,
      opacity: 0.2,
      continuousWorld: true,
      noWrap: true,
      tileSize: this.options.segTileSize
    });

    pseudoseg.drawTile = function(canvas, tilePoint, zoom) {
      var self = this;
      var ctx = canvas.getContext('2d');
      var url = tvOpts.segSource
        .replace(/{tile}/g, tvOpts.tileSize)
        .replace('{x}', tilePoint.x * this.options.tileSize)
        .replace('{y}', tilePoint.y * this.options.tileSize)
        .replace('{zoom}', this.options.maxNativeZoom - zoom)
        .replace('{z}', tvOpts.current_z );
      var img = new Image();
      img.addEventListener('load', function() {
        ctx.drawImage(img,0,0);
        self.tileDrawn(canvas);
      });
      img.src = url;
    }

    // have to override the redraw function as it will try to draw the tiles
    // twice
    pseudoseg.redraw = function () {
      if (this._map) {
        this._reset({hard: true});
        this._update();
      }

      return this;
    };


    function hashCode(string) {
      var hash = 0, i, chr, len;
      if (string.length === 0) {return hash;}
      for (i = 0, len = string.length; i < len; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    }

    function grabDigit(number, position) {
      return Math.floor(number / (Math.pow(10, position)) % 10);
    }


    var segmentation = new L.TileLayer.Canvas({
      async: true,
      maxNativeZoom: this.options.maxZoom,
      opacity: 0.4,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.maxZoom,
      continuousWorld: true,
      noWrap: true,
      tileSize: this.options.segTileSize,
    });
    segmentation.drawTile = function(canvas, tilePoint, zoom) {
      var self = this;
      var ctx = canvas.getContext('2d');
      var url = tvOpts.rawSegSource
        .replace(/{tile}/g, this.options.tileSize)
        .replace('{x}', tilePoint.x * this.options.tileSize)
        .replace('{y}', tilePoint.y * this.options.tileSize)
        .replace('{zoom}', this.options.maxNativeZoom - zoom)
        .replace('{z}', tvOpts.current_z );


      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';

      xhr.send();

      xhr.onload = function(){
        var responseArray   = new Float64Array(this.response);
        var len = responseArray.length;
        var dimensions = Math.sqrt(len);

        canvas.width = dimensions;
        canvas.height = dimensions;

        var imgData = ctx.createImageData(dimensions, dimensions);
        var data    = imgData.data;

        for (var i = 0; i < data.length; i++) {
          var id = responseArray[i];
          if (id) {
            var offset = i * 4;
            var hashed = hashCode(id.toString());
            data[offset] = grabDigit(hashed, 1) * 10 + 30;    // red
            data[offset + 1] = grabDigit(hashed, 3) * 10 + 30;     // green
            data[offset + 2] = grabDigit(hashed, 5) * 10 + 30;     // blue
            data[offset + 3] = 255;     // opacity
          }
        }

        // draw data onto the canvas
        ctx.putImageData(imgData, 0, 0);

        self.tileDrawn(canvas);
      };

    }

    segmentation.redraw = function () {
      if (this._map) {
        this._reset({hard: true});
        this._update();
      }

      return this;
    };
    this.segmentation_layers = [pseudoseg, segmentation];
  }

  this.addMousePosition = function () {
    var self = this;
    // custom functions to show the fully zoomed x,y coordinates
    // under the mouse pointer.
    L.control.mousePosition({
      lngFormatter: function(lng) {
        return Math.round(self.map.project([0,lng], self.options.maxZoom).x);
      },
      latFormatter: function(lat) {
        return Math.round(self.map.project([lat,0], self.options.maxZoom).y);
      },
      lngFirst: true
    }).addTo(this.map);

  };

  this.addNavigationWindow = function () {
    var self = this;
    var layer_options = {
      tileSize: this.options.tileSize,
      opacity: 0.5,
      async: true,
      maxNativeZoom: this.options.maxZoom,
      maxZoom: this.options.maxZoom,
      minZoom: 0,
      continuousWorld: true,
      noWrap: true
    };

    var navlayer = new L.TileLayer.Functional(function(view) {
      // the tileSource url template contains keywords surrounded by {} that will
      // get replaced dynamically as tiles are requested. eg:
      //  http://tem-dvid:7200/api/node/059efe/graytiles/tile/xy/{zoom}/{x}_{y}_{z}
      var url = self.options.tileSource
        .replace(/{tile}/g, this.options.tileSize)
        .replace('{x}', view.tile.column)
        .replace('{y}', view.tile.row)
        .replace('{zoom}', this.options.maxNativeZoom - view.zoom)
        .replace('{z}', self.options.current_z );
      return url;
    }, layer_options);

    var miniMap = new L.Control.MiniMap(navlayer, { autoToggleDisplay: true, zoomLevelFixed: 0 }).addTo(this.map);
    this.navlayer = navlayer;

  };


  this.toggleSegmentation = function (val) {
    if (this.segmentation[val]) {
      this.map.removeLayer(this.segmentation_layers[val]);
      this.segmentation[val] = false;
    } else {
      this.map.addLayer(this.segmentation_layers[val]);
      this.segmentation[val] = true;
    }
  };

  this.jumpTo = function(coords) {
    var center = this.map.getCenter();
    var point  = this.map.project(center, this.options.maxZoom);
    var y = L.Util.formatNum(point.y, 1);
    var x = L.Util.formatNum(point.x, 1);
    if (coords.x) {
      x = parseInt(coords.x);
    }
    if (coords.y) {
      y = parseInt(coords.y);
    }

    this.map.panTo(this.map.unproject([x, y], this.options.maxZoom));
  };

  this.changeLayer = function(opts) {
    var self = this;
    this.options.current_z = parseInt(opts.layer);
    this.map.current_z = this.options.current_z;
    this._layers[1].redraw();
    this._layers[1].once('load', function(e) {
      if (self.navlayer) {
        self.navlayer.redraw();
      }
      self._layers[0].bringToBack();
      self._layers.reverse();
      self.segmentation_layers[0].redraw();
      self.segmentation_layers[1].redraw();
      self.map.fireEvent('zchange');
    });
  };

  this.getCenter = function () {
    var center = this.map.getCenter();
    var point  = this.map.project(center, this.options.maxZoom);
    var y = L.Util.formatNum(point.y, 1);
    var x = L.Util.formatNum(point.x, 1);
    var z = this.options.current_z
    return {x: x, y: y, z: z};
  };


  this._init = function (opts) {
    var self = this;
    L.extend(this.options, opts);

    if (this.options.rawImages) {
      this.options.minZoom = this.options.maxZoom;
    }

    this.createLayers();
    this.createSegmentationLayers();

    this.map = new L.map(this.options.id, {
      layers: this._layers,
      crs: L.CRS.Simple,
      fadeAnimation: false
    });

    this.addMousePosition();


    this.map.fitWorld();
    this.map.setView(this.map.unproject(new L.Point(this.options.x_mid,this.options.y_mid),this.options.maxZoom), this.map.getZoom(), {reset: true})

    this.map.current_z = this.options.current_z;

    if (!this.options.rawImages) {
      this.addNavigationWindow();
    }

    L.control.centerCoordinates({maxZoom: this.options.maxZoom}).addTo(this.map);

    this.map.on('layerchange', function(e) {
      self.changeLayer(e);
    });

  }

  this._init(opts);
};
