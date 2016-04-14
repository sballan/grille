const Core = require('../griller.core.js');
const Promise = require('bluebird');

const collab = function(body) {
  if(!body) return Promise.reject('Missing body argument for parse.collab');

  let collab = {
    username: body.login,
    githubId: "" + body.id,
    avatar_url: body.avatar_url,
    url: body.url,
    html_url: body.html_url,
    repos_url: body.repos_url
  };

  // come back to this - may be repo specific
  // collab.site_admin = body.site_admin;
  //collab.organizations_url = body.organizations_url;

  return Core.dbParse('User', collab);
};

const collabs = function(body) {
  if(!body) return Promise.reject('Missing body argument for parse.collabs');

  return Promise.map(body, function(item) {
    return collab(item)
  });
};

module.exports = {
  collab,
  collabs
};
