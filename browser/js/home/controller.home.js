
app.controller('HomeCtrl', ['$rootScope', '$scope', '$uibModal', 'Socket', 'loadGrille', function($rootScope, $scope, $uibModal, Socket, loadGrille) {

  $scope.repo = loadGrille;
  console.log($scope.repo)

  $scope.repo.getAllLabels()
    .then(labels=> {
      console.log('LABELS',labels)
    });
  //$scope.testCard = $scope.repo.issues[0];



  $scope.storyPointsRange= ["Clear",1,2,3,5,8,13,20,40,100]

  $scope.boardSprintArray=[];

}]);
