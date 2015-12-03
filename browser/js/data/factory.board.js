app.factory('BoardFactory', function(GitHubFactory) {
	var currentBoard;
	//var movingCard;
	var viewLanes = {};

	var BoardFactory = {
		getCurrentBoard: function() {
			return currentBoard;
		},
		setCurrentBoard: function(board) {
			currentBoard = board
			this.readLanes()
			this.writeLanes()
			return currentBoard;
		},
		refreshCurrentBoard: function() {
			var self = this;
			GitHubFactory.getRepo(currentBoard.githubID)
			.then(function(board) {
				self.setCurrentBoard(board)
			})
		},
		getViewLanes: function() {
			return viewLanes;
		},
		// Writes the position of the cards in the lanes to the priority field on each card
		writeLanes: function() {
			for(var lane in viewLanes) {
				viewLanes[lane].forEach(function(card) {
					card.priority = viewLanes[lane].indexOf(card)
					if(card.priority === -1) console.error("writeLanes is broken")
				})
			}
		},
		// Reads the priority of the card and places it in the right lane in the right place
		readLanes: function() {
			viewLanes = {}
			console.log("CurrentBoard", currentBoard)
			currentBoard.lanes.forEach(function(boardLane) {
				viewLanes[boardLane.title] = [];
				var currentLane = viewLanes[boardLane.title]

				currentBoard.cards.forEach(function(card) {
					if(card.lane.title === boardLane.title) {
						console.log("Priority", card.priority)
						if(!card.priority) card.priority = card.issueNumber
						currentLane.push(card)
					}
				})
				currentLane.sort(function(a, b) {
					return a.priority - b.priority
				})
			})
			console.log("viewLanes", viewLanes)
			return viewLanes
		},
		sendAllToBacklog: function() {
			var backLog;

			currentBoard.lanes.forEach(function(lane) {
				if(lane.title === 'Backlog') backLog = lane
			})

			currentBoard.cards.forEach(function(card) {
				card.lane = backLog
			})
		},
		addCard: function(card) {
			viewLanes[card.lane.title].push(card)
			currentBoard.cards.push(card)
			console.log("CURRENT BOARD cards", currentBoard.cards)
			this.readLanes()
			this.writeLanes()
		},

		getBoardAndMakeCurrent: function(repoID) {
			var self = this;
			return GitHubFactory.getRepo(repoID)
			.then(function(board) {
				return self.setCurrentBoard(board)
			})

		}
	}

	return BoardFactory
});
