'use strict'
var Promise = require('bluebird');
var mongoose = require('mongoose');

// FIXME This function is just an outline of what it could be
const dataUpsert = function(dataArr, model) {
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
var n = 1;
const getRemainingPages = function(gitRes, concatData) {
  console.log("--getRemaining", n++);
  console.log("hey");

  concatData = concatData || [];
  var self = this;
  var hasNextPage = self.client.hasNextPage(gitRes.meta.link);
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

const dbFind = function (schema, query) {
  return mongoose.model(schema).find(query)

};

const dbFindOne = function (schema, query) {
  return mongoose.model(schema).findOne(query)

};

const dbFindOneOrCreate = function (schema, query, newData) {
  console.log("SCHEMA", schema)
  return mongoose.model(schema).findOne(query)
  .then(function(dbData) {
    if(!dbData) dbData = newData;
    console.log("-----queries and stuff worked")
    console.log("SCHEMA", schema)
    console.log("dbData", dbData)
    return dbData.save()
  })

};

const dbAssembleRepo = function(req) {
  if(req.comments) var comments = req.comments
  if(req.issues) var issues = req.issues
};

const dbParse = function(schema, raw) {
  console.log("got to dbParse")
  return mongoose.model(schema).findOne(raw.githubId)
  .then(function(model) {
    if(model) return model
    else return mongoose.model(schema).create(raw)
  })
};

module.exports = {
  dataUpsert,
  getRemainingPages,
  dbFind,
  dbFindOne,
  dbFindOneOrCreate,
  dbAssembleRepo,
  dbParse
};
