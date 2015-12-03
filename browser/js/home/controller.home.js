
app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CommentFactory, Socket, loadGrille) {

    // angular.element('body').scrollLeft(50000);
  $scope.board = loadGrille;
  //1
  $scope.cards = $scope.board.cards;

  $scope.viewLanes = BoardFactory.getViewLanes()

  $scope.hovered = false;

	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list',  //need this to use ui-sortable across 2 lists
      stop: function(e, ui) {
        BoardFactory.writeLanes()
        BoardFactory.updateAllPriority()
      }
    };

    function printer (){

    }

    $scope.saveComment = function (card) {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope, $uibModalInstance){
              $scope.theCard = card;

                $scope.ok = function (data) {
                  CommentFactory.addComment(card, data)
                  .then(function(response){
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