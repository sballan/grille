'use strict';

angular.module('Grille')
  .factory('Label', function ($state, DS, DSHttpAdapter) {

    var Label = DS.defineResource({
      name: 'labels',
      relations: {
        belongsTo: {
          issues: {
            localField: 'issue',
            localKey: 'issueId'
          }
        }
      }

    });

    return Label;

  }).run(function (Label) {});
