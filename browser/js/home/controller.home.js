
app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CommentFactory, Socket, loadGrille) {

    // angular.element('body').scrollLeft(50000);
  $scope.board = loadGrille;
  //1
  $scope.cards = $scope.board.cards;
  $scope.lanes = $scope.board.lanes;

  $scope.viewLanes = BoardFactory.getViewLanes()

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
              console.log("card github ID:", card.githubID)

          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope, $uibModalInstance){
              $scope.theCard = card;

                $scope.ok = function (data) {
                  console.log("DATA IS:", data)
                  console.log("scope.theCard", $scope.theCard.comments)
                  CommentFactory.cardAddComment(card, data)
                  .then(function(response){
                    console.log("CommentFactory RESPONSE:", response)
                    $scope.theCard.comments.push(data)
                    $uibModalInstance.close(data);
                  })
                  
                };

                $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };    
            }
          });

          modalInstance.result.then(function () {
            //SAVE editted card changes
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