'use strict';

angular.module('Grille')
  .factory('User', function ($state, DS, DSHttpAdapter) {

    var User = DS.defineResource({
      name: 'users',
      relations: {
        hasMany: {
          repos: {
            localField: 'repos',
            localKey: 'repoId',
            foreignKey: 'userId'
          }
        }

      }

    });

    return User;

  }).run(function (User) {});
