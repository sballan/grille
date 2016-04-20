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
          },
          labels: {
            localField: 'labels',
            localKey: 'labelId',
            foreignKey: ''
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
        getAllLabels: function() {
          return DS.findAll('issues', {
            'repoId':this._id
          })
          .then(issues=>{
            if(!issues) return console.info("No Issues in this Repo")
            return issues.reduce((prev, current)=> {
              return prev.concat(current.getAllLabels())
            })
          })
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
      return DS.find('repos', id, {suffix: '/fullView', bypassCache:true});
    };
    return Repo;

  }).run(function (Repo) {});
