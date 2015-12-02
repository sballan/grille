app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, Socket, loadGrille) {
    // angular.element('body').scrollLeft(50000);
  $scope.board = loadGrille;
  //1
  $scope.cards = $scope.board.cards;
  $scope.lanes = $scope.board.lanes;

  console.log("SCOPE CARD", $scope.cards)

  $scope.hovered = false;

	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };
    //1
    // $scope.cards = setGrille.cards;
    // $scope.lanes= setGrille.lanes;
    // $rootScope.currentBoard = {
    //   cards: $scope.cards,
    //   lanes: $scope.lanes
    // }

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

  $scope.animationsEnabled = true;

});