Router = require('react-router');

exports.tileMapUrl = function(uuid, tile, label) {
  return '#/' + uuid + '/ts/' + tile + '/ls/' + label;
};
