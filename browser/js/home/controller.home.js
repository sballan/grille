
app.controller('HomeCtrl', ['$rootScope', '$scope', '$uibModal', 'Socket', 'currentRepo', function($rootScope, $scope, $uibModal, Socket, currentRepo) {

  $scope.repo = currentRepo;

  $scope.repo.findAllLabels()
    .then(labels=> {
      console.log('LABELS',labels)
    }, function(err) {
      console.error("DIDN'T FIND LABELS", err)

    });
  //$scope.testCard = $scope.repo.issues[0];



  $scope.storyPointsRange= ["Clear",1,2,3,5,8,13,20,40,100]

  $scope.boardSprintArray=[];

}]);
