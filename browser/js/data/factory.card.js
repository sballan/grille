app.factory('CardFactory',function($http){
	return {
		cardAddComment: function(card,comment){
			console.log("~~~FACTORY cardAddComment, card:", card)
			console.log("~~~FACTORY cardAddComment, comment:", comment)
			return $http.post('api/board/cards/post/' + card.githubID, comment)
			.then(function(response){
				console.log(response.data)
				return response.data;
			})
		}
	}
})