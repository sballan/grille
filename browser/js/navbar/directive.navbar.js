app.directive('navbar', ['$rootScope', '$uibModal', 'AuthService', 'AUTH_EVENTS', '$state', 'GitHubFactory', 'BoardFactory', function($rootScope, $uibModal, AuthService, AUTH_EVENTS, $state, GitHubFactory, BoardFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/navbar/navbar.html',
    controller: 'NavBarCtrl'

  };

}]);
