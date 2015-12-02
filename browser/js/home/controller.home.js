app.controller('HomeCtrl', function($rootScope, $scope,$uibModal, HomeFactory, Socket, loadGrille) {
    // angular.element('body').scrollLeft(50000);

	$scope.hovered = false;
	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
  };
  //1
  $scope.cards = loadGrille.cards;
  $scope.lanes= loadGrille.lanes;

  $scope.animationsEnabled = true;

});