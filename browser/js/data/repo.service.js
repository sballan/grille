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
        },

        hasMany: {
          issues: {
            localField: 'issues',
            foreignKey: 'repoId'
          }
        }
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
    Repo.getFullView = function(id) {
      console.log("got to getFullView Resolve")
      return DS.find('repos', id, {suffix: '/fullView'});
    };
    return Repo;

  }).run(function (Repo) {});
