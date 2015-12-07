
app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CommentFactory, Socket, loadGrille, CardFactory) {

  $scope.board = loadGrille;

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
              $scope.modalCard = card;
              console.log("SCOPEMODALCARD:", $scope.modalCard)
              
              //Update a Comment
              $scope.updateComment = function(comment, cardForm){
                cardForm.$setPristine();
                CommentFactory.updateComment(card, comment)
              }
              $scope.cancelComment = function(cardForm){
                cardForm.$setPristine();
              }
              //$scope.cardForm.comments = [];

              //Create a Comment
              $scope.ok = function (data) {
                CommentFactory.addComment(card, data)
                .then(function(updatedCard){
                  console.log("updatedCard", updatedCard)
                  // $scope.modalCard.comments.push(data)
                  $scope.modalCard = updatedCard;
                  $scope.data.body = "";
                  // $uibModalInstance.close(data);
                })
                
              };

              //Delete a Comment
              $scope.deleteComment = function(comment){
                CommentFactory.deleteComment(card, comment)
                .then(function(updatedCommentsArray){
                  console.log("commentFactory.deleteComment RESPONSE YO")
                  $scope.modalCard.comments = updatedCommentsArray;
                })
                // $scope.modalCard.comments.forEach
              }
              //Cancelling from this Modal screen
              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
                  // $uibModalInstance.close(data);
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