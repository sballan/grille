'use strict';

app.factory('Repo', function ($state, DS, DSHttpAdapter) {

    var Repo = DS.defineResource({
      name: 'repos',
      relations: {
        belongsTo: {
          users: {
            localField: 'owner',
            localKey: 'ownerId',
            parent: true
          }
        }
        // hasMany: {
        //   collabs: {
        //     localKey: 'collabId',
        //     localField: 'collaborators',
        //     foreignKey: 'collabRepos'
        //   }
        // }
      },
      // methods: angular.extend({
      // 
      //   stateName: function() {
      //     return 'auth.group.show';
      //   },
      // 
      // }, commentMixin),
      // actions: {
      //   active: {
      //     method: 'GET'
      //   }
      // }
    });
    // Repo.fixRelations = DS.defaults.deserialize.bind(DS.defaults);
    return Repo;

  }).run(function (Repo) {});
