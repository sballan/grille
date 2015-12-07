app.factory('HomeFactory', function($uibModal, CardFactory, BoardFactory, LaneFactory, SprintFactory) {
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

		},
		addSprint: function(animationsEnabled){
			var modalInstance = $uibModal.open({
				animation: animationsEnabled,
				templateUrl: 'js/sprint/template.sprintModal.html',
				controller: 'HomeModalCtrl'
			});
			modalInstance.result.then(function(newSprint) {
				var board =BoardFactory.getCurrentBoard();
				newSprint.board=board._id;
				console.log("sprint add modal instance card", newSprint)
				SprintFactory.addSprint(newSprint)
				.then(function(createdSprint){
				console.log("new sprint", createdSprint);
				})

			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});

		}
		// works but not active in code yet, no point leaving it readable
		// editSprint: function(oldcard){
		// 	var modalInstance = $uibModal.open({
		// 		animation: animationsEnabled,
		// 		templateUrl: 'js/sprint/template.editsprintModal.html',
		// 		controller: 'HomeModalCtrl'
		// 	});
		// 	modalInstance.result.then(function(sprintInfo) {
		// 		console.log(" edit sprint modal instance card", sprintInfo)
		// 		//if null it means it was deleted, thereofre should be sent ot the delete route
		// 		sprintFactory.editSprint(sprintInfo)
		// 		.then(function(){

		// 		})

				

		// 	}, function() {
		// 		console.log('Modal dismissed at: ' + new Date());
		// 	});

		// }

	}

	return HomeFactory

})
