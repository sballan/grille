app.factory('CommentFactory',function($http){
	return {
		cardAddComment: function(card,comment){
			return $http.post('api/board/comments/post/' + card.githubID, {comment: comment, card: card})
			.then(function(response){
				console.log("~~~FACTORY Response: ", response.data)
				return response.data;
			})
		}
	}
})