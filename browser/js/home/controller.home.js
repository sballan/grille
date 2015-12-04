
app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CommentFactory, Socket, loadGrille, CardFactory) {

    // angular.element('body').scrollLeft(50000);
  $scope.board = loadGrille;
  //1
  $scope.cards = $scope.board.cards;

  $scope.viewLanes = BoardFactory.getViewLanes()

  $scope.storyPointsRange= ["Clear",1,2,3,5,8,13,20,40,100]

  $scope.changePoints= function(card,points){
    CardFactory.changePoints(card,points)
    .then(function(updatedCard){
      card.storyPoints=updatedCard.storyPoints;
    })
  }

	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list',  //need this to use ui-sortable across 2 lists
      stop: function(e, ui) {
        console.log("VIEW LANES", BoardFactory.getViewLanes())
        BoardFactory.writeLanes()
        BoardFactory.updateAllPriority()
        BoardFactory.updateAllLanes()
      }
    };

    function printer (){

    }

    $scope.openCommentModal = function (card) {

          //Modal view that opens up
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope, $uibModalInstance){


              //Sets the scope of this modal to the card whose 'comments' icon you just clicked on
              $scope.theCard = card;
              
              //Update a Comment
              $scope.updateComment = function(comment){
                console.dir(comment)
                CommentFactory.updateComment(card, comment)
              }

              //Create a Comment
              $scope.ok = function (data) {
                CommentFactory.addComment(card, data)
                .then(function(response){
                  $scope.theCard.comments.push(data)
                  $uibModalInstance.close(data);
                })
                
              };

              //Cancelling from this Modal screen
              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

            }
          });

          modalInstance.result.then(function () {
          }, function () {
            // console.log('Modal dismissed at: ' + new Date());
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