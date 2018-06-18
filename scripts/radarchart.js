// https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857

function makeRadarChart(){

	var variables = {
		labels: ["Distance", "Time", "Magnitude", "Gas"],
		increments: 5,
		radians: Math.PI * 2,
		width: 500,
		height: 500,
		extraWidth: 200,

		extraHeight: 200
	}

	var radius = Math.min(variables.width, variables.height) / 2
	var svg = d3.select("#radarchart").append("svg").attr("id", "radarSVG")
				.attr("width", variables.width + variables.extraWidth)
				.attr("height", variables.height + variables.extraHeight)
				.selectAll(".increment")


	for (let i = 0; i < variables.increments; i++){
		let factor = (i + 1) * radius / variables.increments
		svg.data(variables.labels).enter()
			.append("svg:line").attr("x1", function(d,j){
				return factor * Math.cos(variables.radians * j / variables.labels.length)})
			.attr("y1", function(d,j){
				return factor * Math.sin(variables.radians * j / variables.labels.length)})
			.attr("x2", function(d,j){
				return factor * Math.cos(variables.radians * (j + 1) / variables.labels.length)})
			.attr("y2", function(d,j){
				return factor * Math.sin(variables.radians * (j + 1) / variables.labels.length)})
			.attr("class", "line")
			.style("stroke", "black")
			.style("stroke-opacity", "0.75")
			.style("stroke-width", "0.3px")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" )


		// Needs data([1]) as dummy variable otherwise this won't work
		svg.data([1]).enter().append("svg:text").attr("x", factor - 2).attr("y", -5)
			.attr("class", "ticks").style("font-family", "sans-serif").style("font-size", "10px")
			.attr("fill", "#737373").text((i + 1) * 100 / variables.increments + "%")
			.style("text-anchor", "end")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" );
	}
		svg.data([...Array(variables.labels.length).keys()]).enter()
			.append("svg:line").attr("x1", 0).attr("y1", 0)
			.attr("x2", function(d){
				return radius * Math.cos(variables.radians / variables.labels.length * (d + 1))})
			.attr("y2", function(d){ 
				return radius * Math.sin(variables.radians / variables.labels.length * (d + 1))})
			.attr("class", "line").attr("id", "radarRadius")
			.style("stroke", "black")
			.style("stroke-opacity", "1")
			.style("stroke-width", "1px")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" );

		svg.data(variables.labels).enter().append("svg:text")
			.attr("x", function(d,i){
				return radius * Math.cos(variables.radians / variables.labels.length * (i + 1))
							 + 20 * Math.cos(variables.radians / variables.labels.length * (i + 1))})
			.attr("y", function(d,i){
				return radius * Math.sin(variables.radians / variables.labels.length * (i + 1)) 
							+ 10 * Math.sin(variables.radians / variables.labels.length * (i + 1))})
			.attr("class", "radarLabel").attr("id",function(d){ return d })
			.style("font-family", "sans-serif").style("font-size", "10px").attr("text-anchor", "middle")
			.attr("fill", "#737373").text(function(d){ return d})
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" );

}

function updateRadarChart(rawData, scaleEdges){
	d3.selectAll("polygon").remove();

	var dimensions = document.getElementById("radarSVG").getBoundingClientRect()
	var width = dimensions.width
	var height = dimensions.height
	var radius = document.getElementById("radarRadius").getBoundingClientRect().height
	var data = dataForD3(radius, rawData, scaleEdges, "radar")

	var x = d3.scaleLinear().range([- radius, radius]);
	var y = d3.scaleLinear().range([- radius, radius]);

	var svg = d3.select("#radarchart").select("svg")

	var coordinates = makeCoordinatesForPolygon(data)
	console.log(coordinates)

	svg.selectAll("polygon").data([coordinates]).enter().append("polygon").attr("points", function(d){
		return d.map(function(d) {
            return [d.x, d.y].join(",")
        }).join(" ")

		}).attr("id", "henk").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.style("fill-opacity", 0.5)
		// 
}
