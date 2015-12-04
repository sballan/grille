app.config(function ($stateProvider) {
    $stateProvider.state('visual', {
        url: '/visual',
        templateUrl: 'js/visual/template.visual.html',
        controller: 'VisualCtrl'
    })
})
