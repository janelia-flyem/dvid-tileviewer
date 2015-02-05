var root = 'http://emdata2.int.janelia.org';

var settings = {
  datatype: 'grayscale'
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
