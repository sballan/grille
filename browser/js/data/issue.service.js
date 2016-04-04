'use strict';

angular.module('Grille')
  .factory('Issue', function ($state, DS, DSHttpAdapter) {

    var Issue = DS.defineResource({
      name: 'issues',
      relations: {
        belongsTo: {
          users: {
            localField: 'owner',
            localKey: 'ownerId',
          },
          repos : {
            localField: 'repo',
            localKey: 'repoId',
            foreignKey: 'issueId'
          }
        },
        hasMany: {
          labels: {
            localField: 'labels',
            localKey: 'labelId',
            foreignKey: 'issueId'
          }
        }
      }

    });

    return Issue;

  }).run(function (Issue) {});
