var root = 'http://emdata2.int.janelia.org';
var root = 'http://emrecon100.janelia.priv';
//var root = 'http://tem-dvid';

var settings = {
  // the data instance that will be used to fetch the tiles
  datatype: 'graytiles',
  // the data instance that provides information about the
  // dimensions of the volume. Sometimes, this is the same as
  // the datatype.
  infotype: 'grayscale',
};


exports.settings = settings;

exports.baseUrl = function() {
  return root;
};

exports.datatypeInfoUrl = function(uuid, datatype) {
  return root + '/api/node/' + uuid + '/' + datatype + '/info';
};

exports.repoInfoUrl = function(uuid) {
  return root + '/api/repo/' + uuid  + '/info';
};

exports.reposInfoUrl = function(uuid) {
  return root + '/api/repos/info';
};
