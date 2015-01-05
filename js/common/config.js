var root = 'http://emdata2.int.janelia.org/';

exports.repoInfoUrl = function(uuid) {
  return root + 'api/repo/' + uuid  + '/info';
};

exports.reposInfoUrl = function(uuid) {
  return root + 'api/repos/info';
};
