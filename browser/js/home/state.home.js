app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/template.home.html',
        controller: 'HomeCtrl'
    });
});



