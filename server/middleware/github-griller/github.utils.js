'use strict'
var Promise = require('bluebird');
var Board = require('mongoose').model('Board');
var mongoose = require('mongoose')

// FIXME This function is just an outline of what it could be
exports.dataUpsert = function(dataArr, model) {
  Promise.map(dataArr, function(dataItem, index) {
        if (!dataItem) dataItem = { githubId: null }

        return model.findOneAndUpdate({
          githubId: dataItem.githubId
        }, data[index], {
          upsert: true,
          new: true
        })
      })
      .then(function(dataUpserted) {
        res.send(dataUpserted)
      })
};

// A generic function for getting the remaining pages of a github request. Expects a github client, a config object, and a function to get data from github
exports.getRemainingPages = function(gitRes, concatData=[]) {
  var self = this;
  var hasNextPage = self.client.hasNextPage(gitRes.meta.link);
  concatData = concatData.concat(gitRes);

  if(hasNextPage) {
    self.config.page++;
    return self.githubFunc(self.config)
        .then(function(newRes) {
          return self.getRemainingPages(newRes, concatData)
        })
  } else {
    return concatData;
  }
};

exports.dbFind = function (schema, query) {
  console.log('got to find', schema, query)
  return mongoose.model(schema).find(query)

};

exports.dbFindOne = function (schema, query) {
  console.log('got to find', schema, query)
  return mongoose.model(schema).findOne(query)

};

exports.dbAssembleRepo = function(req) {
  if(req.comments) var comments = req.comments
  if(req.issues) var issues = req.issues
};

exports.dbFindAll = function (schema, query) {

};

