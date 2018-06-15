// https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857

function makeRadarChart(){

	var variables = {
		labels: ["Distance", "Time", "Magnitude", "Gas"],
		increments: 5,
		radians: Math.PI * 2,
		width: 500,
		height: 500,
		extraWidth: 100,

		extraHeight: 100
	}

	var radius = Math.min(variables.width, variables.height)
	var svg = d3.select("#radarchart").append("svg")
				.attr("width", variables.width + variables.extraWidth)
				.attr("height", variables.height + variables.extraHeight)


	for (let i = 0; i < variables.increments; i++){
		let factor = (i + 1) * radius / (variables.increments * 2)
		svg.selectAll(".increment").data(variables.labels).enter()
			.append("svg:line").attr("x1", function(d,j){
				return factor * Math.cos(variables.radians * j / variables.labels.length)})
			.attr("y1", function(d,j){
				return factor * Math.sin(variables.radians * j / variables.labels.length)})
			.attr("x2", function(d,j){
				return factor * Math.cos(variables.radians * (j + 1) / variables.labels.length)})
			.attr("y2", function(d,j){
				return factor * Math.sin(variables.radians * (j + 1) / variables.labels.length)})
			.attr("class", "line")
			.style("stroke", "grey")
			.style("stroke-opacity", "0.75")
			.style("stroke-width", "0.3px")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" )
	}
	
}


