app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, Socket, testGrille) { //displayBoard
    // angular.element('body').scrollLeft(50000);

    // var socket = io();
    // Socket.on('update', function(data){
      // console.log("WEBHOOK DATA RECEIVED. The data is:", data)
    // })

  //if loggedin/authenticated, then state.go
  $scope.items = [
      { label: 'Home', state: 'home' },
      { label: 'Admin', state: 'membersOnly', auth: true },
      { label: 'Charts', state:'visual'}
  ];

	$scope.hovered = false;
	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };

    console.log("Test Grille", testGrille)
    $scope.cards = testGrille.cards;
    $scope.lanes= testGrille.lanes;
    $rootScope.currentBoard = {
      cards: $scope.cards,
      lanes: $scope.lanes
    }


    $scope.animationsEnabled = true;

    $scope.addLane = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'js/home/template.laneModal.html',
        controller: 'HomeModalCtrl'
        // size: size
      });

      modalInstance.result.then(function (newLane) {
          var spot=newLane.position;
          newLane.ownCards = [];
          $scope.lanes.splice(spot, 0, newLane);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
  };

    $scope.addCard=function(){
        console.log("ADDING CARD")
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'js/home/template.cardModal.html',
        controller: 'HomeModalCtrl'
      });

      modalInstance.result.then(function (newCard) {

          $scope.lanes[0].ownCards.push(newCard.title)
          console.log("scopelanes", $scope.lanes[0])
          // scope.$digest()
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

});