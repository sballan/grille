app.controller('HomeCtrl', function($scope, HomeFactory, BoardFactory, Socket, loadGrille) {
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

  $scope.animationsEnabled = true;

});