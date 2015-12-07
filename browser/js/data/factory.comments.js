app.factory('CommentFactory',function($http, BoardFactory){
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
		},
		deleteComment: function(card,comment){
			//$http.delete doesn't permit a 'body' to be sent, so use a .put and treat it as a delete
			return $http.put('api/comments/delete/' + card.githubID, {comment: comment, card: card})
			.then(function(response){
				BoardFactory.refreshCurrentBoard()
				return response.data
			})
		}

	}
})