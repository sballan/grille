app.config(function ($stateProvider) {
    $stateProvider.state('visual', {
        url: '/visual',
        templateUrl: 'js/visual/visual.html',
        controller: 'VisualCtrl'
    });
})
.controller("VisualCtrl",function($scope){
	
});