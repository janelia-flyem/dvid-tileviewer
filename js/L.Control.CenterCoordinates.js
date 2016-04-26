L.Control.CenterCoordinates = L.Control.extend({
  options: {
    position: 'topright',
    emptyString: 'Unavailable',
    maxZoom: 4
  },

  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-centercoordinates');
    L.DomEvent.disableClickPropagation(this._container);
    map.on('move', this._onMapMove, this);
    map.on('zchange', this._onMapZChange, this);
    this._container.innerHTML=this._coordinatesFromMap(map);
    return this._container;
  },

  onRemove: function (map) {
    map.off('move', this._onMapMove);
  },

  _onMapZChange: function (e) {
    var value = this._coordinatesFromMap(e.target);
    this._container.innerHTML = value;
  },

  _onMapMove: function (e) {
    var value = this._coordinatesFromMap(e.target);
    this._container.innerHTML = value;
  },

  _coordinatesFromMap: function (map) {
    var center = map.getCenter();
    var point  = map.project(center, this.options.maxZoom);
    var x = L.Util.formatNum(point.x, 1);
    var y = L.Util.formatNum(point.y, 1);
    var z = map.current_z;
    var value = 'X: ' + x + ', Y: ' + y + ', Z: ' + z;
    return value;
  }
});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.CenterCoordinates();
        this.addControl(this.positionControl);
    }
});

L.control.centerCoordinates = function (options) {
    return new L.Control.CenterCoordinates(options);
};
