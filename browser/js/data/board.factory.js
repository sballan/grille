app.factory('BoardFactory', function(GitHubFactory, $rootScope) {
	var currentBoard;
	var movingCard;
	var viewLanes = {};

	BoardFactory = {
		getCurrentBoard: function() {
			return currentBoard;
		},
		setCurrentBoard: function(board) {
			currentBoard = board;
			readLanes()
			return currentBoard;
		},
		// Writes the position of the cards in the lanes to the priority field on each card
		writeLanes: function() {
			for(lane in viewLanes) {
				viewLanes[lane].forEach(function(card) {
					card.priority = viewLanes[lane].indexOf(card)
					if(card.priority === -1) console.error("writeLanes is broken")
				})
			}
		},
		// Reads the priority of the card and places it in the right lane in the right place
		readLanes: function() {
			viewLanes = {}

			currentBoard.lanes.forEach(function(boardLane) {
				viewLanes[boardLane.title] = [];
				var currentLane = viewLanes[boardLane.title]

				currentBoard.cards.forEach(function(card) {
					if(card.lane.title === boardLane.title) {
						viewLanes[card.priority] = card
					}
				})
			})
			return viewLanes
		}
		sendAllToBacklog: function() {
			var backLog;

			currentBoard.lanes.forEach(function(lane) {
				if(lane.title === 'Backlog') backLog = lane
			})

			currentBoard.cards.forEach(function(card) {
				card.lane = backLog
			})
		},
		pullCard: function(card) {

		},
		moveCard: function(card, lane, index) {

		}
	}

	return BoardFactory
});