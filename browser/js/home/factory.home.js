app.factory('HomeFactory', function(){
	var fillLanes = [
				{
					title:"Backlog",
				    content:"content..",
				    label:"label for it",
				    ownCards:["card9","card10","card11","card12"]},
				    {title:"Ready",
				    content:"content....",
				    label:"label for it",
				    ownCards:["card5","card6","card7","card8"]},
				    {title:"In Progress",
				    content:"content.....",
				    label:"labels for it",
				    ownCards:["card1","card2","card3","card4"]},
				    {title:"Done",
				    content:"content.....",
				    label:"label for it",
				    ownCards:["card13","card14","card15","card16"]}
    		]
	return {
		loadCards: function(){
			/*
			call to $http to check DB if the lanes have already been created. load that data
			If not, then do what is below..
			*/

			return 3
		},
		loadLanes: function() {
			return 3
		}
	}
})