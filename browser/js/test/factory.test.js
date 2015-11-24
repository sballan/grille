app.factory('TestFactory', function($http){
	var TestFactory = {
		getAllRepos: function() {
			return $http.get('/api/repos/getAll')
		}
	}

	return TestFactory
})