app.factory('CommentFactory', ['$http', 'BoardFactory', function($http, BoardFactory){
	var toData = function(response){
		return response.data
	}
	return {
		addComment: function(card,comment){
			return $http.post('api/comments/' + card.githubID, {comment: comment, card: card})
			.then(function(response){
				BoardFactory.refreshCurrentBoard()
				return response.data;
			})
		},
		updateComment: function(card,comment){
			return $http.put('api/comments/' + card.githubID, {comment: comment, card: card})
			.then(function(response){
				BoardFactory.refreshCurrentBoard()
				return response.data
			})
		},
		deleteComment: function(card,comment){
			return $http.delete('api/comments/' + card.githubID + '/' + card.board + '/' + comment.githubID)
			.then(function(response){
				BoardFactory.refreshCurrentBoard()
				return response.data
			})
		}

	}
}])
