app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope,$uibModal) {
	$scope.hovered = false;
	$scope.leftArray = ['test1', 'test2' ] 
	$scope.rightArray = ['test3', 'test4' ] 
	$scope.sortableOptions = {
    	connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
    };
    $scope.lanes=[{title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire"},{title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire"},{title:"YOLO",
    content:"yloswag",
    label:"burnitwithfire"}]
    $scope.addIssue=function(){
        // going to need a modal or form and then submit that
    }
    $scope.addLane =function(contentObj){
         // going to need a modal or form and then submit that
         var spot=contentObj.position;
        $scope.lanes.splice(spot, 0, contentObj);
    }
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

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.ok = function () {
    $uibModalInstance.close(/*$scope.selected.item*/);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});