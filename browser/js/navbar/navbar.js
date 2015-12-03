app.directive('navbar', function ($rootScope, $uibModal, AuthService, AUTH_EVENTS, $state, GitHubFactory, BoardFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'Admin', state: 'membersOnly', auth: true },
                { label: 'Charts', state:'visual'}
            ];
            if (AuthService.isAuthenticated){
              //scope.items[0].state = 'home({ githubID: $rootScope.currentBoard.githubID })'
              // console.log($rootScope.currentBoard)
            }
            scope.isOpen = false;
            scope.user = null;



            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            // scope.lanes = HomeFactory.loadLanes();


    scope.hovered = false;
    scope.sortableOptions = {
        connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };
    //scope.lanes = BoardFactory.getCurrentBoard().lanes
    //scope.cards = BoardFactory.getCurrentBoard().cards

    scope.animationsEnabled = true;

    scope.addLane = function () {
      var modalInstance = $uibModal.open({
        animation: scope.animationsEnabled,
        templateUrl: 'js/home/template.laneModal.html',
        controller: 'HomeModalCtrl'
        // size: size
      });

      modalInstance.result.then(function (newLane) {
          var spot = newLane.position;
          newLane.ownCards = [];
          scope.lanes.splice(spot, 0, newLane);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
  };

    scope.addCard=function(){
      var modalInstance = $uibModal.open({
        animation: scope.animationsEnabled,
        templateUrl: 'js/home/template.cardModal.html',
        controller: 'HomeModalCtrl'
      });

      modalInstance.result.then(function (newCard) {
          newCard.lane = {};
          newCard.lane._id = BoardFactory.getCurrentBoard().lanes[0]._id
          BoardFactory.getCurrentBoard().cards.push(newCard)

          // scope.lanes[0].ownCards.push(newCard.title)
          // console.log("rootscopelanes", $rootScope.currentBoards.cards[length-1])


      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }
        }

    };


});
