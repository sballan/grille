app.factory('BoardFactory', function(GitHubFactory, CardFactory) {
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
				viewLanes[lane].forEach(function(card, index) {
					card.priority = index
					if(card.priority < 0) console.error("writeLanes is broken")
				})
				viewLanes[lane].sort(function(a, b) {
					return a.priority - b.priority
				})
			}


			console.log("Cached Cards")
			currentBoard.cards.forEach(function(card) {
				console.log(card.issueNumber + ": " + card.priority)
			})
		},
		// Reads the priority of the card and places it in the right lane in the right place
		readLanes: function() {
			// viewLanes = {}
			console.log("CurrentBoard", currentBoard)
			currentBoard.lanes.forEach(function(boardLane) {
				viewLanes[boardLane.title] = [];
				var currentLane = viewLanes[boardLane.title]

				currentBoard.cards.forEach(function(card) {
					if(card.lane.title === boardLane.title) {
						//if(!card.priority) card.priority = card.issueNumber
						currentLane.push(card)
					}
				})
				currentLane.sort(function(a, b) {
					return a.priority - b.priority
				})
			})
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
			console.log("BOARD ADD CARD", card)
			//viewLanes[card.lane.title].push(card)
			currentBoard.cards.push(card)
			console.log("CURRENT BOARD cards", currentBoard.cards)
			this.readLanes()
			this.writeLanes()
			this.updateAllPriority()
		},

		getBoardAndMakeCurrent: function(repoID) {
			var self = this;
			return GitHubFactory.getRepo(repoID)
			.then(function(board) {
				return self.setCurrentBoard(board)
			})

		},
		updateAllPriority: function() {
			return CardFactory.updatePriorityCards(currentBoard.cards)
			.then(function(cards) {
				cards.forEach(function(card) {
					currentBoard.cards.forEach(function(c) {
						if(c.githubID === card.githubID) {
							c.priority = card.priority
						}
					})
				})
			})
		}
	}

	return BoardFactory
});
