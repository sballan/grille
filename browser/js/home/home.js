app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope) {
	// $scope.items = ['test1', 'test2'];
	// $scope.items2 = ['test3', 'test4'];
 $scope.leftArray = ['test1', 'test2' ] 
  $scope.rightArray = ['test3', 'test4' ] 
  $scope.sortableOptions = {
    connectWith: '.connectedItemsExample .list' //need this to use ui-sortable across 2 lists
  };
})