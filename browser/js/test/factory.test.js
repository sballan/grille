app.factory('TestFactory', function($http){
	var TestFactory = {
		getAllRepos: function() {
			return $http.get('/api/github/repos/getAll')
			.then(function(res) {
				return res.data
			})
		}
	}

	return TestFactory
})