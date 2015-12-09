app.controller("VisualCtrl",function($scope, $rootScope){

	$scope.daysToComplete=null;
    //would let the user choose but for now we pick to test
    $scope.daysToComplete=20;
    $scope.totalPoints=60;
    $scope.lineData = [
    	{
		 storyPoints: 2,
		 day: 1
		},{
		 storyPoints: 5,
		 day: 2
		},{
		 storyPoints: 1,
		 day: 3
		},{
		 storyPoints: 1,
		 day: 4
		},{
		 storyPoints: 8,
		 day: 5
		},{
		 storyPoints: 5,
		 day: 6
		}
	];

	var lineData = [{
		   'x': 1,
		   'y': 5
		 }, {
		   'x': 20,
		   'y': 20
		 }, {
		   'x': 40,
		   'y': 10
		 }, {
		   'x': 60,
		   'y': 40
		 }, {
		   'x': 80,
		   'y': 5
		 }, {
		   'x': 100,
			'y': 60
 	}];

 var vis = d3.select('#visualisation'),
		   WIDTH = 800,
		   HEIGHT = 350,
		   MARGINS = {
		     top: 20,
		     right: 20,
		     bottom: 20,
		     left: 50
		   },
		   xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
		     return d.x;
		   }), d3.max(lineData, function(d) {
		     return d.x;
		   })]),
		   yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
		     return d.y;
		   }), d3.max(lineData, function(d) {
		     return d.y;
		   })]),
		   xAxis = d3.svg.axis()
		     .scale(xRange)
		     .tickSize(5)
		     .tickSubdivide(true),
		   yAxis = d3.svg.axis()
		     .scale(yRange)
		     .tickSize(5)
		     .orient('left')
		     .tickSubdivide(true);

		     
vis.append('svg:g')
 .attr('class', 'x axis')
 .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
 .call(xAxis);

vis.append('svg:g')
 .attr('class', 'y axis')
 .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
 .call(yAxis);

var lineFunc = d3.svg.line()
  .x(function(d) {
    return xRange(d.x);
  })
  .y(function(d) {
    return yRange(d.y);
  })
  .interpolate('linear');

  vis.append('svg:path')
  .attr('d', lineFunc(lineData))
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

});

