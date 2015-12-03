app.factory('CommentFactory',function($http){
	return {
		addComment: function(card,comment){
			return $http.post('api/board/comments/' + card.githubID, {comment: comment, card: card})
			.then(function(response){
				console.log("~~~FACTORY Response: ", response.data)
				return response.data;
			})
		},
		editComment: function(card,comment){
			
		}

	}
})