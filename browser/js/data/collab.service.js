'use strict';

angular.module('Grille')
  .factory('Collab', function ($state, DS, DSHttpAdapter) {

    var Collab = DS.defineResource({
      extends: 'users',
      name: 'collabs',
      relations: {
        belongsTo: {
          repo: {
            localField: 'collabRepos',
            localKey: 'collabRepoId',
            parent: true
          }
        }
      }

    });

    return Collab;

  }).run(function (Collab) {});
