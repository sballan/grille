'use strict'
var Promise = require('bluebird');
var mongoose = require('mongoose');
var chalk = require('chalk');

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

const dbParse = function(schema, raw, populate=null) {
  return mongoose.model(schema).findOne({githubId: raw.githubId})
    .then(function(model) {
      if(!!model) return model;
      else return mongoose.model(schema).create(raw)
    })
    .then(function(model) {
      if(!!populate) return model.deepPopulate(populate)
      else return model
    })
};

const dbFind = function (schema, query, populate) {
  if(populate) return mongoose.model(schema).find(query).deepPopulate(populate)
  return mongoose.model(schema).find(query)

};

const dbFindOne = function (schema, query, populate) {
  if(populate) return Promise.resolve(mongoose.model(schema).findOne(query).deepPopulate(populate));
  return Promise.resolve(mongoose.model(schema).findOne(query).exec());
};



module.exports = {
  getRemainingPages,
  dbFind,
  dbFindOne,
  dbParse
};
