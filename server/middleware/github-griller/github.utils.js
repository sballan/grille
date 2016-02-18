'use strict'
var Promise = require('bluebird');
var Board = require('mongoose').model('Board');

// FIXME This function is just an outline of what it could be
exports.dataUpsert = function(dataArr, model) {
  Promise.map(dataArr, function(dataItem, index) {
        if (!dataItem) dataItem = { githubID: null }

        return model.findOneAndUpdate({
          githubID: dataItem.githubID
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

