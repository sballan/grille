app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, Socket, setGrille) { //displayBoard
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
    //1
    $scope.cards = setGrille.cards;
    $scope.lanes= setGrille.lanes;
    $rootScope.currentBoard = {
      cards: $scope.cards,
      lanes: $scope.lanes
    }
    //or 2
    // $rootScope.currentBoard = {
    //   cards: testGrille.cards,
    //   lanes: testGrille.lanes
    // }
    // $scope.cards = $rootScope.currentBoard.cards;
    // $scope.lanes = $rootScope.currentBoard.lanes;


    $scope.animationsEnabled = true;

    $scope.editCard = function (card) {
      console.log("editting card:", card)
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope){
              $scope.theCard = card;
            }
          });

          modalInstance.result.then(function (edittedCard) {
            //SAVE editted card changes
              // var spot=newLane.position;
              // newLane.ownCards = [];
              // $scope.lanes.splice(spot, 0, newLane);
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
          });
    };
  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };    


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

});