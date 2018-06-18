function makeBarchart(rawData, scaleEdges){

	var labels = ["AbsMagnitude","Spectrum","Velocity","ColorIndex"];

	var margin = {top: 40, right: 20, bottom: 50, left: 40},
		width = 500 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	var barWidth = width / (labels.length)

	var xScale = d3.scaleLinear().range([height,0]).domain([0,Infinity]),
		xAxis = d3.axisLeft().scale(xScale)

	// var tooltip = d3.select("#barchart").append("div").attr("id", "barTooltip")
	// 		      .attr("class", "tooltip")
	// 		      .style("opacity", 0);

	var data = dataForD3(height, rawData, scaleEdges, "bar")

	// add the svg on which the bar chart is placed
	var svg = d3.select("#barchart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// add labels
	svg.selectAll("text.axis").data(labels).enter().append("text").attr("class","barLabel")
			.attr("transform", "translate(0," + height + ")")
			.attr("y", margin.bottom / 2).attr("id", function(d){ return d.split(' ').join('')})
			.attr("x", function(d,i){
				return (width  - (i + .5) * barWidth)
			}).text(function(d){return d}).attr("text-anchor", "middle")


	// add the bar
	svg.append("g").attr("class", "axis tick")
			.call(xAxis).exit()

	// var	bars = d3.select("#barchart").select("svg").select("g").selectAll(".bar").data(data).enter().append("rect")
		
	// 				.attr("fill", "rgba(8, 81, 156, 0.6)")
	// 				.attr("stroke", "rgba(8, 81, 156, 0.6)")
	// 				.attr("transform", "translate(0," + height + ")")
	// 				.attr("class","bar").attr("y",  function(d){
	// 					return - Math.abs(d["value"])
	// 				}).attr("x", function(d){
	// 					return d["x"]
	// 				})
	// 				.attr("height", function(d){
	// 					return Math.abs(d["value"])
	// 				})
	// 				.attr("width", barWidth).attr("class", "bar")

	// 	bars.on("mouseover", function(d) {
	// 			if (d["id"] == "Spectrum"){ 
	// 				tooltip.html("This star is of type: " + types[Math.round(d["value"]/height * labels.length) - 1] )
	// 						.style("opacity", .9)
	// 						.style("left", 555 + d["x"] + "px")
	// 	            		.style("top", height + 35 - d["value"] + "px")
	// 	            		.style("display", "inline-block")}
	// 			else{
	// 				tooltip.html("This is " + Math.round(d["value"] * 10000 / height)/100 + " % of the maximum")
	// 					.style("opacity", .9)
	// 					.style("left", 520 + d["x"] + "px")
	//             		.style("top", height + 35 - d["value"] + "px")
	//             		.style("display", "inline-block") }})
	// 		.on("mouseout", function(){tooltip.style("opacity", 0)})
}


function updateBarchart(rawData, scaleEdges){

	var height = 410;
	var barWidth = 30;
	var data = dataForD3(height, rawData, scaleEdges, "bar")
	var types = ['S', 'N', 'R', 'M', 'K', 'G', 'F', 'A', 'B', 'O', 'W']

	d3.selectAll(".bar").remove();
	d3.selectAll(".barTooltip").remove();
	
	
	var tooltip = d3.select("#barchart").append("div").attr("id", "barTooltip")
			      .attr("class", "tooltip")
			      .style("opacity", 0);
    
 	var svgBarchart = d3.select("#barchart").select("svg").select("g")

	var	bars = svgBarchart.selectAll(".bar").data(data).enter().append("rect")
		
		.attr("fill", "rgba(8, 81, 156, 0.6)")
		.attr("stroke", "rgba(8, 81, 156, 0.6)")
		.attr("transform", "translate(0," + height + ")")
		.attr("class","bar").attr("y",  function(d){
			return - Math.abs(d["value"])
		}).attr("x", function(d){
			return d["x"]
		})
		.attr("height", function(d){
			return Math.abs(d["value"])
		})
		.attr("width", barWidth).attr("class", "bar")
		

		bars.on("mouseover", function(d) {
				if (d["id"] == "Spectrum"){ 
					tooltip.html("This star is of type: " + types[Math.round(d["value"]/height * labels.length) - 1] )
							.style("opacity", .9)
							.style("left", d3.event.layerX + "px")
		            		.style("top", d3.event.layerY + "px")
		            		.style("display", "inline-block")}
				else{
					tooltip.html("This is " + Math.round(d["value"] * 10000 / height)/100 + " % of the maximum")
						.style("opacity", .9)
						.style("left", d3.event.layerX + "px")
	            		.style("top", d3.event.layerY + "px")
	            		.style("display", "inline-block") }})
			.on("mouseout", function(){
					tooltip.style("opacity", 0).style("left", 0 + "px")
	            		.style("top", 0 + "px")})

}

