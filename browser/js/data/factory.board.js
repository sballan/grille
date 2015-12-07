app.factory('BoardFactory', function(GitHubFactory, CardFactory, $rootScope) {
	var currentBoard = null;
	var hashLanes = {};
	//var movingCard;
	var viewLanes = {};

	var BoardFactory = {
		getCurrentBoard: function() {
			return currentBoard;
		},
		setCurrentBoard: function(board) {
			currentBoard = board

			currentBoard.lanes.forEach(function(lane) {
				hashLanes[lane.title] = lane._id
			})

			this.readLanes()
			this.writeLanes()
			return currentBoard;
		},
		removeCurrentBoard: function() {
			currentBoard = null;
		},
		refreshCurrentBoard: function() {
			var self = this;

			//OP: ES6 => context remains same as outer scope, don't need self
			GitHubFactory.getRepo(currentBoard.githubID)
			.then(function(board) {
				self.setCurrentBoard(board)
			})
		},
		getViewLanes: function() {
			return viewLanes;
		},
		getHashLanes: function() {
			return hashLanes;
		},
		// Writes the position of the cards in the lanes to the priority field on each card
		writeLanes: function() {

			for(var lane in viewLanes) {
				viewLanes[lane].forEach(function(card, index) {
					var hashLane = hashLanes[lane]

					card.priority = index

					if(card.state === 'closed') {
						card.lane = hashLanes['Done']
					} else if(lane === 'Done'){
						card.state = 'closed'
					} else {
						card.state = 'open'
						card.lane = hashLane
					}


					if(card.priority < 0) console.error("writeLanes is broken")
				})
				viewLanes[lane].sort(function(a, b) {
					return a.priority - b.priority
				})
			}

		},
		// Reads the priority of the card and places it in the right lane in the right place
		readLanes: function() {
			// viewLanes = {}
			console.log('Labels: ',currentBoard.labels)
			currentBoard.lanes.forEach(function(boardLane) {
				viewLanes[boardLane.title] = [];
				var currentLane = viewLanes[boardLane.title]

				currentBoard.cards.forEach(function(card) {
					if(card.lane._id === hashLanes[boardLane.title] ||
						 card.lane === hashLanes[boardLane.title]) {
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
		//OP: does this need to return something?L
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
			//viewLanes[card.lane.title].push(card)
			currentBoard.cards.push(card)
			this.writeLanes()
			this.readLanes()
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
			return CardFactory.updatePriorityMany(currentBoard.cards)
			.then(function(cards) {
				cards.forEach(function(card) {
					currentBoard.cards.forEach(function(c) {
						if(c.githubID === card.githubID) {
							c.priority = card.priority
						}
					})
				})
			})
		},
		updateAllLanes: function() {
			return CardFactory.updateLaneMany(currentBoard.cards)
			.then(function(cards) {
				cards.forEach(function(card) {
					currentBoard.cards.forEach(function(c) {
						if(c.githubID === card.githubID) {
							c.lane = card.lane
						}
					})
				})
			})
		}
	}

	return BoardFactory
});
