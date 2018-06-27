/*
This script makes a radarchart and updates it
inpiration by:
https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857
made by
Alwan Rashid (10580204)
*/
function makeRadarChart(rawData, scaleEdges, colour){
/*
This function makes a radar chart in a colour
*/
	// declare some variables
	var variables = {
		labels: ["Distance", "Time", "Magnitude", "Gas"],
		increments: 5,
		radians: Math.PI * 2,
		width: 300,
		height: 300,
		extraWidth: 150,
		extraHeight: 100
	};

	// calculate radius
	var radius = Math.min(variables.width, variables.height) / 2;

	// add svg 
	var svg = d3.select("#radarchart")
				.append("svg")
				.attr("id", "radarSVG")
				.attr("width", variables.width + variables.extraWidth)
				.attr("height", variables.height + variables.extraHeight);
	
	// make tooltip
	var radarTooltip = d3.select("#radarchart")
							.append("div")
							.attr("id", "radarTooltip")
						    .attr("class", "tooltip")
						    .style("opacity", 0);

	var title = "Data about distance from Earth to star number " + rawData["StarID"];

	// add title
	svg.append("text")
		.attr("x", (variables.width + variables.extraWidth) / 2)
		.attr("y", variables.extraHeight / 4)
		.attr("text-anchor", "middle")
		.attr("id", "titleRadarChart")
		.text(title);

	// make the lines
	for (let i = 0; i < variables.increments; i++){
		
		// which level of line
		let factor = (i + 1) * radius / variables.increments

		// add the lines
		svg.selectAll(".increment")
			.data(variables.labels)
			.enter()
			.append("svg:line")
			.attr("x1", function(d,j){
				return factor * Math.cos(variables.radians * j / variables.labels.length);
				})
			.attr("y1", function(d,j){
				return factor * Math.sin(variables.radians * j / variables.labels.length);
				})
			.attr("x2", function(d,j){
				return factor * Math.cos(variables.radians * (j + 1) / variables.labels.length);
				})
			.attr("y2", function(d,j){
				return factor * Math.sin(variables.radians * (j + 1) / variables.labels.length);
				})
			.attr("class", "line")
			.style("stroke", "black")
			.style("stroke-opacity", "0.75")
			.style("stroke-width", "0.3px")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
					+ "," + (variables.height + variables.extraHeight) / 2 + ")" );

		// add the ticks 
		// Needs data([1]) as dummy variable otherwise this won't work
		svg.selectAll(".increment")
			.data([1])
			.enter()
			.append("svg:text")
			.attr("x", factor - 2)
			.attr("y", -5)
			.attr("class", "ticks")
			.style("font-family", "sans-serif")
			.style("font-size", "10px")
			.attr("fill", "#737373")
			.text((i + 1) * 100 / variables.increments + "%")
			.style("text-anchor", "end")
			.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")" );
	};

	// add the line from the origin to the angles
	svg.selectAll(".increment")
		.data([...Array(variables.labels.length).keys()])
		.enter()
		.append("svg:line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d){
			return radius * Math.cos(variables.radians / variables.labels.length * (d + 1));
			})
		.attr("y2", function(d){ 
			return radius * Math.sin(variables.radians / variables.labels.length * (d + 1));
			})
		.attr("class", "line")
		.attr("id", "radarRadius")
		.style("stroke", "black")
		.style("stroke-opacity", "1")
		.style("stroke-width", "1px")
		.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
							+ "," + (variables.height + variables.extraHeight) / 2 + ")" );

	// add the labels 
	svg.selectAll(".increment")
		.data(variables.labels)
		.enter()
		.append("svg:text")
		.attr("x", function(d,i){
			return radius * Math.cos(variables.radians / variables.labels.length * (i + 1))
						 + 20 * Math.cos(variables.radians / variables.labels.length * (i + 1));
			})
		.attr("y", function(d,i){
			return radius * Math.sin(variables.radians / variables.labels.length * (i + 1)) 
						+ 10 * Math.sin(variables.radians / variables.labels.length * (i + 1));
			})
		.attr("class", "radarLabel")
		.attr("id",function(d){ 
			return d;
			})
		.style("font-family", "sans-serif")
		.style("font-size", "10px")
		.attr("text-anchor", "middle")
		.attr("fill", "#737373")
		.text(function(d){ 
			return d;
			})
		.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
							+ "," + (variables.height + variables.extraHeight) / 2 + ")" );


	var x = d3.scaleLinear().range([- variables.width / 2, variables.width / 2]);
	var y = d3.scaleLinear().range([- variables.height / 2, variables.height / 2]);
	var data = dataForD3(radius, rawData, scaleEdges, "radar");
	var coordinates = makeCoordinatesForPolygon(data);

	// make the radar chart itself
	var radarchart = svg.selectAll("polygon")
						.data([coordinates])
						.enter()
						.append("polygon")
						.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
								+ "," + (variables.height + variables.extraHeight) / 2 + ")")
						.attr("points", function(d){
							return d.map(function(d) {
					            return [d.x, d.y].join(",");
					    		}).join(" ");
							})
						.style("fill-opacity", 0.5)
						.attr("fill", colour);

	// enter circles add the intersection between the axes and the chart
	svg.selectAll(".circle")
		.data(coordinates)
		.enter()
		.append("circle")
		.attr("transform", "translate(" + (variables.width + variables.extraWidth) / 2 
				+ "," + (variables.height + variables.extraHeight) / 2 + ")")
		.attr("cx", function(d){
			return d.x;
		})
		.attr("cy", function(d){ 
			return d.y;
		})
		.attr("r", 2)
		.attr("class", "circle")
		.attr("fill", "grey")
		.on("mouseover", function(d){
			d3.select(this).attr("r", 10).style("opacity", 0.5);
			showTooltip(d, rawData, "radar");
		}).on("mouseout", function(d){
			d3.select(this).attr("r", 2).style("opacity", 1);
			hideTooltip("radar");
		});
};

function updateRadarChart(rawData, scaleEdges,colour){
/*
This function updates the radar chart
*/
	// change title
	$("#titleRadarChart").html("Data about the relationship between Earth and star number " + rawData["StarID"])
	
	// get radius
	var radius = document.getElementById("radarRadius").getBoundingClientRect().height
	var data = dataForD3(radius, rawData, scaleEdges, "radar")

	// select the correct svg
	var svg = d3.select("#radarchart")
				.select("svg")

	var coordinates = makeCoordinatesForPolygon(data)

	// alter polygon
	var polygon = svg.selectAll("polygon")
						.data([coordinates])
						.transition()
						.duration(1000)
						.attr("points", function(d){
							return d.map(function(d) {
	            				return [d.x, d.y].join(",");
							    }).join(" ");
							})
						.style("fill-opacity", 0.5)
						.attr("fill", colour);

	// alter circles
	// on hover enlarge circle and add opacity
	var circles = svg.selectAll(".circle")
						.data(coordinates)
						.on("mouseover", function(d){
							d3.select(this).attr("r", 10).style("opacity", 0.5);
							showTooltip(d, rawData, "radar");
						})
						.on("mouseout", function(d){
							d3.select(this).attr("r", 2).style("opacity", 1);
							hideTooltip("radar");
						});
	circles.transition()
			.duration(1000)
			.attr("cx", function(d){ 
				return d.x;
			})
			.attr("cy", function(d){ 
				return d.y;
			})
			.attr("r", 2)
			.attr("class", "circle")
			.attr("fill", "grey");
};
