'use strict';

angular.module('Grille')
  .factory('Issue', function ($state, DS, DSHttpAdapter) {

    var Issue = DS.defineResource({
      name: 'issues',
      relations: {
        belongsTo: {
          users: {
            localField: 'owner',
            localKey: 'ownerId'
          },
          repos : {
            localField: 'repo',
            localKey: 'repoId',
            foreignKey: 'issueId',
            parent: true
          }
        },
        hasMany: {
          labels: {
            localField: 'labels',
            localKey: 'labelId',
            foreignKey: 'issueId'
          }
        }
      },
      methods: {
        getLabels: function() {
          return this.labels.map(label=>{
            return !!label._id ? label._id : label;
          })
        }
      }


    });

    return Issue;

  }).run(function (Issue) {});
