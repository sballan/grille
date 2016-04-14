'use strict';
var Promise = require('bluebird');

// Returns the G object
const getAll = function(G=this) {
  let config = { repo:null, user:null};

  return G.Core.githubGet(G, config, G.client.repos.getAll)
    .then(G.Parse.repos)
    .then(allRepos=> {
      if(!allRepos) return Promise.reject('allRepos was empty or undefined');

      G.repos = allRepos;
      return G;
    })

};
// Returns the G object
const getOne = function(G=this, id=G.repo._id) {
  if(!id) return Promise.reject('No ID argument and so repo on Griller object');

  const repo = G.repo || G.Core.dbFindOne('Repo', {_id: id});

  return Promise.resolve(repo)
    .then(dbRepo=> {
      if(!dbRepo) return Promise.reject("Repo wasn't in database")
      G.repo = dbRepo;

      if(G.getFull) return getOneFull(G);
      return G
    })
};

// Private function
// Returns context dependent G object
const getOneFull = function(G=this) {
  if(G.repo) return Promise.reject('No repo on Griller object');

  console.log("----GetOneFull");
  return G.Issues.getAll(G)
  .then((g=G)=> {
    console.log("----GotIssues");
    return g.Comments.getAllForIssues(g, g.repo)
  })
  .then((g=G)=> {
    console.log("---GotComments");
    return g;
  })
  .then((g=G)=>{
    return g.Collabs.getAll(g);
  })

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
