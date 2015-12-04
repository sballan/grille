app.controller('NavBarCtrl', function($scope, $rootScope, $uibModal, AuthService, AUTH_EVENTS, $state, GitHubFactory, BoardFactory, HomeFactory) {

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

  $scope.isOpen = false;
  $scope.user = null;

  $scope.isLoggedIn = function() {
    return AuthService.isAuthenticated();
  };

  $scope.logout = function() {
    AuthService.logout().then(function() {
      $scope.user = null;
      $state.go('landing');
    });
  };

  var setUser = function() {
    AuthService.getLoggedInUser().then(function(user) {
      $scope.user = user;
    });
  };

  var removeUser = function() {
    $scope.user = null;
  };

  setUser();

  $scope.hovered = false;
  $scope.sortableOptions = {
    connectWith: '.connectedItemsExample .list'
  };

  $scope.animationsEnabled = true;

  $scope.addLane = function() {
    HomeFactory.addLane($scope.animationsEnabled)
  };

  $scope.addCard = function() {
    HomeFactory.addCard($scope.animationsEnabled)
  }
})
