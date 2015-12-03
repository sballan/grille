app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CardFactory, Socket, loadGrille) {
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
    $scope.yell = function(){console.log("HEYYY")}
    $scope.editCard = function (card) {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope, $uibModalInstance){
              $scope.theCard = card;
                $scope.ok = function (data) {
                  $uibModalInstance.close(data);
                };

                $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };    
            }
          });

          modalInstance.result.then(function (comment) {
            //SAVE editted card changes
            console.log("edittedCard:", comment)
            CardFactory.cardAddComment(card,comment)
            console.log("~~~CONTROLLER CardFactory executed")
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
          });
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