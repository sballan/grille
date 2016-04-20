'use strict';

angular.module('Grille')
  .factory('Label', function ($state, DS, DSHttpAdapter) {

    var Label = DS.defineResource({
      name: 'labels',
      relations: {
        belongsTo: {
          repos: {
            localField: 'repo',
            localKey: 'repoId',
            parent: true
          }
        },
        hasMany: {
          issues: {
            localField: 'issue',
            localKey: 'issueId',
            foreignKey: 'labelId'
          }
        }
      }

    });

    return Label;

  }).run(function (Label) {});
