
app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, BoardFactory, CommentFactory, Socket, loadGrille, CardFactory,SprintFactory) {

  $scope.board = loadGrille;

  $scope.cards = $scope.board.cards;

  $scope.viewLanes = BoardFactory.getViewLanes

  $scope.storyPointsRange= ["Clear",1,2,3,5,8,13,20,40,100]
  var boardSprintArray=null;
  $scope.boardSprints= function(){
    return boardSprintArray;
  };

  $scope.getAllSprints = function(){
     SprintFactory.getAllSprints($scope.board._id)
     .then(function(allSprints){
      console.log("all sprints", allSprints)
      boardSprintArray= allSprints;
      console.log("boardSprints",boardSprintArray)
     })
  }

  $scope.updateCardTitle = function(card){
    CardFactory.updateCardTitle(card)
    .then(function(updatedCard){
      card.title = updatedCard.title;
    })
  }

  $scope.changePoints= function(card,points){
    CardFactory.changePoints(card,points)
    .then(function(updatedCard){
      card.storyPoints=updatedCard.storyPoints;
    })
  }

  $scope.addSprint = function(){
    HomeFactory.addSprintModal();
  }

  $scope.editSprint = function(card){
    HomeFactory.editSprintModal(card);
  }






	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list',  //need this to use ui-sortable across 2 lists
      stop: function(e, ui) {
        BoardFactory.writeLanes()
        BoardFactory.updateAllPriority()
        BoardFactory.updateAllLanes()
      }
    };

    $scope.openCommentModal = function (card) {

          //Modal view that opens up
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/home/template.editCardModal.html',
            controller: function($scope, $uibModalInstance){


              //Sets the scope of this modal to the card whose 'comments' icon you just clicked on
              $scope.modalCard = card;


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


  $scope.animationsEnabled = true;

});