'use strict';

angular.module('Grille')
  .factory('Issue', function ($state, DS, DSHttpAdapter) {

    var Issue = DS.defineResource({
      name: 'issues',
      relations: {
        belongsTo: {
          owner: {
            localField: 'owner',
            localKey: 'ownerId',
          },
          repo : {
            localField: 'repo',
            localKey: 'repoId'
          }
        },
        hasMany: {

        }
      }

    });

    return Issue;

  }).run(function (Issue) {});
