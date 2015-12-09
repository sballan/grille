app.factory("SprintFactory",function($http,BoardFactory,$rootScope){
	function toData(res) {
		return res.data
	};

	var cachSprints=[];

	var SprintFactory= {
		addSprint:function(newSprint){
			return $http.post('api/milestones/',newSprint)
			.then(function(res){
				var board=BoardFactory.getCurrentBoard();
				$rootScope.$broadcast('Sprint created',{sprint:res.data});
				console.log("Cached sprints", cachSprints);
				console.log("Cached sprints", res.data);
				cachSprints.push(res.data);
				return res.data;
			})
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
			.then(function(res){
				console.log("res.data", res.data)
				cachSprints= res.data;
				return res.data;
			})
		},

		getOneSprint:function(sprint){
			return $http.get('api/milestones/:id')
			.then(toData)
		},
		getCachedSprints:function(){
			return cachSprints;
		},
		setCachedSprints:function(){
			
		}



	}
	return SprintFactory;
});