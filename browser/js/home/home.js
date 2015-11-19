app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope,$uibModal) {
    angular.element('body').scrollLeft(50000); 
	$scope.hovered = false;
	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };
    $scope.lanes=[{title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire",
    ownCards:["card9","card10","card11","card12"]},
    {title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire",
    ownCards:["card5","card6","card7","card8"]},
    {title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire",
    ownCards:["card1","card2","card3","card4"]}]
    $scope.addIssue=function(){
        // going to need a modal or form and then submit that
    }
         // going to need a modal or form and then submit that
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'js/home/addLaneModal.html',
      controller: 'ModalInstanceCtrl',
      size: size
      // resolve: {
      //   items: function () {
      //     return $scope.items;
      //   }
      // }
    });

    modalInstance.result.then(function (newLane) {
        var spot=newLane.position;
        $scope.lanes.splice(spot, 0, newLane);
        console.table(newLane)
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.ok = function (lane) {
    $uibModalInstance.close(lane);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});