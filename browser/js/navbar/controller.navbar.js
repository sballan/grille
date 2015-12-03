app.controller('NavBarCtrl', function($scope, $rootScope, $uibModal, AuthService, AUTH_EVENTS, $state, GitHubFactory, BoardFactory, HomeFactory) {

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

  $scope.items = [{ label: 'Home', state: 'home' },
  { label: 'Admin', state: 'membersOnly', auth: true },
  { label: 'Charts', state: 'visual' }];

  $scope.isOpen = false;
  $scope.user = null;

  $scope.isLoggedIn = function() {
    return AuthService.isAuthenticated();
  };

  $scope.logout = function() {
    AuthService.logout().then(function() {
      $state.go('home');
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
    connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
  };
  // $scope.lanes = BoardFactory.getCurrentBoard().lanes
  // $scope.cards = BoardFactory.getCurrentBoard().cards

  $scope.animationsEnabled = true;

  $scope.addLane = function() {
    HomeFactory.addLane($scope.animationsEnabled)
  };

  $scope.addCard = function() {
    HomeFactory.addCard($scope.animationsEnabled)
  }
})
