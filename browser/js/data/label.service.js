'use strict';

angular.module('Grille')
  .factory('Label', function ($state, DS, DSHttpAdapter) {

    var Label = DS.defineResource({
      name: 'labels',
      relations: {
        belongsTo: {
          issues: {
            localField: 'issue',
            localKey: 'issueId',
            parent: true
          }
        }
      }

    });

    return Label;

  }).run(function (Label) {});
