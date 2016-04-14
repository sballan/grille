'use strict';
const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');
const chalk = require('chalk');

// A generic function for getting the remaining pages of a github request. Expects a github client, a config object, and a function to get data from github
const getRemainingPages = function(gitRes, concatData=[]) {
  const self = this;
  const hasNextPage = self.client.hasNextPage(gitRes.meta.link);

  concatData = concatData.concat(gitRes);

  if(hasNextPage) {
    self.config.page++;
    return self.githubFunc(self.config)
        .then(newRes=> {
          return getRemainingPages.call(self, newRes, concatData)
        })
  } else {
    return Promise.resolve(concatData);
  }
};

// Private function
const checkDefaults = function(obj1, obj2) {
  if(obj1 === null) return undefined;
  if(obj1 === undefined) return obj2;
  return obj1;
};

const githubGet = function(G, config, func) {
  if(G.repo) {
    config.user = checkDefaults(config.user, G.repo.owner.username);
    config.repo = checkDefaults(config.repo, G.repo.name);
  }
  config.per_page = checkDefaults(config.per_page, 100);
  config.page = checkDefaults(config.page, 1);
  config.sort = checkDefaults(config.sort, 'updated');

  for(let e in config) {
    if(!config[e]) delete config[e];
  }

  const context = {
    client: G.client,
    githubFunc: Promise.promisify(func),
    config: config
  };

  const getPages = getRemainingPages.bind(context);

  return context.githubFunc(config)
    .then(getPages)
};

const dbParse = function(schema, raw, populate=undefined) {
  if(!schema || !raw) return Promise.reject('Missing schema or raw argument');

  return mongoose.model(schema).findOne({githubId: raw.githubId}).exec()
    .then(function(model) {
      if(!!model) return model;
      else return mongoose.model(schema).create(raw)
    })
    .then(function(model) {
      if(!model) return Promise.reject('dbParse failed', raw);
      if(!!populate) {
        // TODO had an error here before that was fixed with Promise.resolve...it's gone now...
        return model.deepPopulate(populate)
      } else {
        return Promise.resolve(model)
      }
    })
};

const dbSave = function(document, populate=undefined) {
  if(!document || !document.save) return Promise.reject('Missing or invalid document.');

  return document.save()
    .then(dbDoc=> {
      if(populate) return dbDoc.deepPopulate(populate);
      return dbDoc;
    })
    .then(dbDoc=> {
      // Ensure that previously populated fields aren't lost.
      _.merge(document, dbDoc);
      return document;
    })

};

const dbFind = function (schema, query, populate=undefined) {
  if(!schema || !query) return Promise.reject('Missing schema or query argument');

  if(populate) return mongoose.model(schema).find(query).deepPopulate(populate);
  return mongoose.model(schema).find(query).exec()

};

const dbFindOne = function (schema, query, populate) {
  if(!schema || !query) return Promise.reject('Missing schema or query argument');

  if(populate) return mongoose.model(schema).findOne(query).deepPopulate(populate);
  return mongoose.model(schema).findOne(query).exec();
};



module.exports = {
  getRemainingPages,
  githubGet,
  dbParse,
  dbSave,
  dbFind,
  dbFindOne

};
