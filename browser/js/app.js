'use strict';
window.app = angular.module('Grille', [
  'fsaPreBuilt',
  'js-data',
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'ui.sortable',
  'ngMaterial'
]);

app.config(function ($urlRouterProvider, $locationProvider) {
  // This turns off hashbang urls (/#about) and changes it to something normal (/about)
  $locationProvider.html5Mode(true);
  // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
  $urlRouterProvider
  .when('/auth/github', '/auth/github')
  .otherwise('/welcome');
});

app.config(function ($stateProvider) {
  $stateProvider.state('auth', {
      url: '/auth/github',
      external: true,
  });
});

app.run(function (DS, $state) {
  DS.defaults.basePath = '/api';
  DS.defaults.idAttribute = '_id';

  // // 413 error request entity too large
  DS.defaults.serialize = function (resource, data) {
    if (resource.relationFields && resource.relationFields.length){
        data = angular.copy(data);
        resource.relationFields.forEach(function(relation){
          if(data[relation] && typeof data[relation] === 'object') {
            data[relation] = data[relation]._id
          }
        });
    }
    return data;
  };

  DS.defaults.methods.url = function () {
    if (!this.hasOwnProperty('_id')) { return null; }
    return '/api/' + this.resourceName + '/' + this._id;
  };

  // /* stateName and params will get overwritten
  // at resource definition if different from default */
  // DS.defaults.methods.stateName = function() {
  //   return 'auth.' + this.resourceName;
  // };

  DS.defaults.methods.params = function() {
    return { id: this._id };
  };

  // DS.defaults.methods.go = function() {
  //   $state.go(this.stateName(), this.params());
  // };

  // DS.defaults.methods.sref = function() {
  //   return $state.href(this.stateName(), this.params());
  // }

  // DS.defaults.methods.getModelName = function() {
  //   return this.__t;
  // }

  // More by Jason Dobry
  angular.extend(DS.defaults, {
    beforeInject: function (Resource, instance) {
      // "instance.resourceName" will only be accessible via "instance.resourceName"
      // won't be enumerated
      // won't be JSONified
      // Object.defineProperty doesn't work like this in IE8

      // instance is either a single object or an array of objects...
      function defineResourceName(i) {
        // if an instance is in 2 caches, keep its resource name as the initial one
        if (i.resourceName) { return; }
        i.resourceName = Resource.name;
      }

      if (Array.isArray(instance)) { instance.forEach(defineResourceName); }
      else { defineResourceName(instance); }
    }
  });
})


// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, $window, BoardFactory) {

  $rootScope.$on('$stateChangeError', function(e, n, np, p, pp, err) {
    console.error('State Change Error:', err);
  });
  // The given state requires an authenticated user.
  var destinationStateRequiresAuth = function (state) {
    return state.data && state.data.authenticate;
  };

  // $stateChangeStart is an event fired
  // whenever the process of changing a state begins.
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

    if (toState.name === 'userSettings') {
      BoardFactory.removeCurrentBoard();
    }

    if (toState.external) {
      event.preventDefault();
      $window.open(toState.url, '_self');
    }

    if (!destinationStateRequiresAuth(toState)) {
      // The destination state does not require authentication
      // Short circuit with return.
      return;
    }

    if (AuthService.isAuthenticated()) {
      // The user is authenticated.
      // Short circuit with return.
      return;
    }

    // Cancel navigating to new state.
    event.preventDefault();

    AuthService.getLoggedInUser().then(function (user) {
      // If a user is retrieved, then renavigate to the destination
      // (the second time, AuthService.isAuthenticated() will work)
      // otherwise, if no user is logged in, go to "login" state.
      if (user) {
        $state.go(toState.name, toParams);
      } else {
        $state.go('landing');
      }
    });

  });



});
