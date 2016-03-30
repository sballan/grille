'use strict';

app.factory('Repo', function ($state, DS, DSHttpAdapter) {

    var Repo = DS.defineResource({
      name: 'repos',
      relations: {
        belongsTo: {
          users: {
            localField: 'owner',
            localKey: 'ownerId',
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
      methods: {
        activeOn: function() {
          return this.DSUpdate({active: true});
        },
        activeOff: function() {
          return this.DSUpdate({active: false});
        }

      }
      // actions: {
      //   active: {
      //     method: 'GET'
      //   }
      // }
    });
    // Repo.fixRelations = DS.defaults.deserialize.bind(DS.defaults);
    return Repo;

  }).run(function (Repo) {});
