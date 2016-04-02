'use strict';

angular.module('Grille')
  .factory('User', function ($state, DS, DSHttpAdapter) {

    var User = DS.defineResource({
      name: 'users',
      relations: {
        hasMany: {
          repos: {
            localField: 'repos',
            foreignKey: 'userId'
          }
        }
        // hasMany: {
        //   repos: {
        //     localField: 'collabRepos',
        //     localkey: 'collabRepoId',
        //     foreignKey: 'collabId'
        //   }
        // }
      }

    });

    return User;

  }).run(function (User) {});
