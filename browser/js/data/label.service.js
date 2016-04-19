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
      },
      methods: {
        findAllForRepo: function() {
          return DS.find('repos', {'repoId': this.issue.repoId}, {suffix: 'labels'})
        }
      }

    });

    return Label;

  }).run(function (Label) {});
