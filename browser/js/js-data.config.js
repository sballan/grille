'use strict';

angular.module('Grille')
  .config(function(DSProvider) {
    // Mongoose Relation Fix (fixes deserialization)
    // From http://plnkr.co/edit/3z90PD9wwwhWdnVrZqkB?p=preview
    // This was shown to us by @jmdobry, the idea here is that
    // we fix the data coming from Mongoose models in js-data rather than outbound from Mongoose
    function fixRelations(Resource, instance) {
      function fixLocalKeys(i) {
        JSData.DSUtils.forEach(Resource.relationList, function(def) {
          var relationName = def.relation;
          var relationDef = Resource.getResource(relationName);
          if (def.type === 'hasMany') {
            if (i.hasOwnProperty(def.localField)) {
              if (i[def.localField].length && !JSData.DSUtils.isObject(i[def.localField][0])) {
                // Case 1: array of _ids where array of populated objects should be
                i[def.localKeys] = i[def.localField];
                delete i[def.localField];
              } else if (!i[def.localKeys]) {
                // Case 2: array of populated objects, but missing array of _ids'
                i[def.localKeys] = [];
                JSData.DSUtils.forEach(i[def.localField], function(child) {
                  i[def.localKeys].push(child[relationDef.idAttribute]);
                });
              }
            }
          }
          else if (def.type === 'belongsTo' || def.type === 'hasOne') {
            if (i.hasOwnProperty(def.localField)) {
              // if the localfIeld is a popualted object
              if (JSData.DSUtils.isObject(i[def.localField])) {
                i[def.localKey] = i[def.localField]._id;
              }
              // if the localfield is an object id
              else if (!JSData.DSUtils.isObject(i[def.localField])) {
                i[def.localKey] = i[def.localField];
                delete i[def.localField];
              }
            }
          }
        });
      }
      if (JSData.DSUtils.isArray(instance)) {
        JSData.DSUtils.forEach(instance, fixLocalKeys);
      } else {
        fixLocalKeys(instance);
      }
    }


    DSProvider.defaults.deserialize = function(Resource, data) {
      var instance = data.data || data;
      fixRelations(Resource, instance);
      return instance;
    };
    // End Mongoose Relation fix
  });
