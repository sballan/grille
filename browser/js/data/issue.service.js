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

        }
      }

    });

    return Issue;

  }).run(function (Issue) {});
