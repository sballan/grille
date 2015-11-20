app.controller('HomeCtrl', function($scope,$uibModal, HomeFactory) {
    // angular.element('body').scrollLeft(50000); 
	$scope.hovered = false;
	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };

    $scope.lanes= HomeFactory.loadLanes();

    $scope.addCard=function(){
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'js/home/template.cardModal.html',
        controller: 'HomeModalCtrl'
      });

      modalInstance.result.then(function (newCard) {
          $scope.lanes[0].ownCards.push(newCard.title)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

    $scope.animationsEnabled = true;

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

});