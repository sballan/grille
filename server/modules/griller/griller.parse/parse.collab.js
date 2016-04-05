const Core = require('../griller.core.js');
const Promise = require('bluebird');

const collab = function(body) {
  if(!body) return null;
  var collab = {};
  collab.username = body.login;

  collab.githubId = "" + body.id;
  collab.avatar_url = body.avatar_url;
  collab.url = body.url;
  collab.html_url = body.html_url;
  // come back to this - may be repo specific
  // collab.site_admin = body.site_admin;
  //collab.organizations_url = body.organizations_url;
  collab.repos_url = body.repos_url;
  return Core.dbParse('User', collab);
};

const collabs = function(body) {
  return Promise.map(body, function(item) {
    return collab(item)
  });
};

module.exports = {
  collab,
  collabs
};
