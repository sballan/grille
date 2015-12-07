app.factory('HomeFactory', function($uibModal, CardFactory, BoardFactory, LaneFactory) {
	var HomeFactory = {
		addLane: function(animationsEnabled) {
			var modalInstance = $uibModal.open({
				animation: animationsEnabled,
				templateUrl: 'js/home/template.laneModal.html',
				controller: 'HomeModalCtrl'
			});

			modalInstance.result.then(function(newLane) {
				newLane.boardID = BoardFactory.getCurrentBoard()._id;
				LaneFactory.createLane(newLane)
				.then(function(lane) {
					console.log('lane created - ', lane);
				})
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});
		},
		addCard: function(animationsEnabled) {
			var modalInstance = $uibModal.open({
				animation: animationsEnabled,
				templateUrl: 'js/home/template.cardModal.html',
				controller: 'HomeModalCtrl'
			});

			modalInstance.result.then(function(newCard) {
				console.log("We hit the home factory")
				console.log("Modal instance card", newCard)
				newCard.lane = BoardFactory.getCurrentBoard().lanes[0]
				newCard.board = BoardFactory.getCurrentBoard()

				CardFactory.addCard(newCard)
				.then(function(card) {
					console.log("Card in factory home", card)
					BoardFactory.addCard(card)
				})

			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});

		}
	}

	return HomeFactory

})
