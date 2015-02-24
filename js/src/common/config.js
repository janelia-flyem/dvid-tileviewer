// Set the base url of the DVID server that you are trying to
// contact.
var root = 'http://hackathon.janelia.org';

var settings = {
  // Set the data instance that will be used to fetch the tiles. This should
  // be a data instance of type multiscale2d.
  datatype: 'graytiles',
  // Set the data instance that provides information about the
  // dimensions of the volume. This should be a data instance of
  // type grayscale8.
  infotype: 'grayscale',
};
exports.settings = settings;

// Set the dvid url that will return the tiles. This example is for the
// multiscale2d data instance, but others are possible.
exports.tileFetchUrl = function(uuid, level, plane, x, y, z) {
  var api_url = root + "/api/node/" + uuid + "/" + settings.datatype + "/tile/" + plane + "/" + level + "/" + x + "_" + y + "_" + z;
  return api_url;
}

// request information about a specific data instance within
// a repository.
exports.datatypeInfoUrl = function(uuid, datatype) {
  return root + '/api/node/' + uuid + '/' + datatype + '/info';
};

// request information about a specific repository
exports.repoInfoUrl = function(uuid) {
  return root + '/api/repo/' + uuid  + '/info';
};

// request information about all the repositories in the
// root DVID instance.
exports.reposInfoUrl = function(uuid) {
  return root + '/api/repos/info';
};

exports.baseUrl = function() {
  return root;
};
