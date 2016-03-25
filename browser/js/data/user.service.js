'use strict';

angular.module('Grille')
  .factory('User', function ($state, DS, DSHttpAdapter) {

    var User = DS.defineResource({
      name: 'users',
      relations: {
        hasMany: {
          repo: {
            localField: 'repos',
            foreignKey: 'userId'
          }
        }
      }

    });

    return User;

  }).run(function (User) {});
