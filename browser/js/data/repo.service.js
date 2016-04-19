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
        },
        hasMany: {
          issues: {
            localField: 'issues',
            localKey: 'issueId'
          },
          users: {
            localField: 'collabs',
            localKey: 'collabId',
            foreignKey: 'collabRepoId'
          }
        }

      },
      methods: {
        activeOn: function() {
          return this.DSUpdate({active: true});
        },
        activeOff: function() {
          return this.DSUpdate({active: false});
        },
        findAllLabels: function() {
          console.log("ID is HERE", this._id, typeof this._id);
          return DS.find('repos', this._id, {suffix: '/labels', bypassCache:true})
        }

      }

    });
    // Repo.fixRelations = DS.defaults.deserialize.bind(DS.defaults);
    Repo.getFullView = function(id) {
      console.log("got to getFullView Resolve");
      return DS.find('repos', id, {suffix: '/fullView', bypassCache:true});
    };
    return Repo;

  }).run(function (Repo) {});
