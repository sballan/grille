'use strict'
var Promise = require('bluebird');
var mongoose = require('mongoose');

// A generic function for getting the remaining pages of a github request. Expects a github client, a config object, and a function to get data from github
const getRemainingPages = function(gitRes, concatData) {
  const self = this;
  const hasNextPage = self.client.hasNextPage(gitRes.meta.link);

  concatData = concatData || [];
  concatData = concatData.concat(gitRes);

  if(hasNextPage) {
    self.config.page++;
    return self.githubFunc(self.config)
        .then(function(newRes) {
          return getRemainingPages.call(self, newRes, concatData)
        })
  } else {
    return concatData;
  }
};

const dbParse = function(schema, raw) {
  return mongoose.model(schema).findOne(raw.githubId)
  .then(function(model) {
    if(model) return model
    else return mongoose.model(schema).create(raw)
  })
};

const dbFind = function (schema, query, populate) {
  return mongoose.model(schema).find(query).exec()

};

const dbFindOne = function (schema, query, populate) {
  return mongoose.model(schema).findOne(query).exec()
};

const dbFindOneOrCreate = function (schema, query, newData) {
  return mongoose.model(schema).findOne(query)
  .then(function(dbData) {
    if(!dbData) dbData = newData;
    return dbData.save()
  })

};

// TODO This might belong somewhere else; maybe on the griller object itself? Also passing g seems weird here.
const dbAssembleRepo = function(g) {
  if(!g.repo) return false;

  if(g.comments) g.repo.comments = g.comments
  if(g.issues) g.repo.issues = g.issues
  if(g.collabs) g.repo.collabs = g.collabs
  console.log("assembled: ", g)
  return g;
};


module.exports = {
  getRemainingPages,
  dbFind,
  dbFindOne,
  dbFindOneOrCreate,
  dbAssembleRepo,
  dbParse
};
