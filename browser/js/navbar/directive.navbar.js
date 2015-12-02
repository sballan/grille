app.directive('navbar', function($rootScope, $uibModal, AuthService, AUTH_EVENTS, $state, GitHubFactory, BoardFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/navbar/navbar.html',
    controller: 'NavBarCtrl'

  };

});
