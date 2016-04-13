'use strict';
const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');
const chalk = require('chalk');

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
    return Promise.resolve(concatData);
  }
};

const checkDefaults = function(obj1, obj2) {
  if(obj1 === null) return undefined;
  if(obj1 === undefined) return obj2;
  return obj1;
};

const githubGet = function(g, config, func) {
  if(g.repo) {
    config.user = checkDefaults(config.user, g.repo.owner.username);
    config.repo = checkDefaults(config.repo, g.repo.name);
  }
  config.per_page = checkDefaults(config.per_page, 100);
  config.page = checkDefaults(config.page, 1);
  config.sort = checkDefaults(config.sort, 'updated');

  for(let e in config) {
    if(!config[e]) delete config[e];
  }

  const context = {
    client: g.client,
    githubFunc: Promise.promisify(func),
    config: config
  };
  console.log("13")

  const getPages = getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(config))
    .then(getPages)
};

const dbParse = function(schema, raw, populate=null) {
  return mongoose.model(schema).findOne({githubId: raw.githubId}).exec()
    .then(function(model) {
      console.log("17")
      if(!!model) return model;
      else return mongoose.model(schema).create(raw)
    })
    .then(function(model) {
      if(!model) return Promise.reject('dbParse failed', raw)
      console.log("18")
      if(!!populate) {
        console.log("19")
        return model.deepPopulate(populate);
      } else {
        console.log("20")
        return Promise.resolve(model)
      }
    })
};

const dbSave = function(document, populate) {
  if(!document.save) return Promise.reject('Only documents can be dbSaved.')
  return document.save()
    .then((dbDoc)=> {
      if(populate) return dbDoc.deepPopulate(populate);
      return dbDoc;
    })
    .then((dbDoc)=> {
      _.merge(document, dbDoc);
      return document;
    })

};

const dbFind = function (schema, query, populate) {
  if(populate) return mongoose.model(schema).find(query).deepPopulate(populate);
  return mongoose.model(schema).find(query)

};

const dbFindOne = function (schema, query, populate) {
  if(populate) return Promise.resolve(mongoose.model(schema).findOne(query).deepPopulate(populate));
  return Promise.resolve(mongoose.model(schema).findOne(query).exec());
};



module.exports = {
  getRemainingPages,
  githubGet,
  dbParse,
  dbSave,
  dbFind,
  dbFindOne

};
