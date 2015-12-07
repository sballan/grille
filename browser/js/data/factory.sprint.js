app.factory("SprintFactory",function($http){
	function toData(res) {
		return res.data
	}

	return {
		addSprint:function(newSprint){
			return $http.post('api/milestones/',newSprint)
			.then(toData)
		},
		editSprint:function(sprint){
			return $http.put('api/milestones/'+sprint._id,sprint)
			.then(toData)
		},
		deleteSprint:function(sprint){
			return $http.delete('api/milestones/'+sprint._id)
		},
		getAllSprints:function(boardId){
			return $http.get('api/milestones/all/'+boardId)
			.then(toData)
		},

		getOneSprint:function(sprint){
			return $http.get('api/milestones/:id')
			.then(toData)
		}







	}
});