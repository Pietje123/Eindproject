function makeBarchart(rawData, scaleEgdes){

	var labels = ["AbsMagnitude","Spectrum","Velocity","ColorIndex"];

	var margin = {top: 40, right: 20, bottom: 50, left: 40},
		width = 300 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	var barWidth = width / (labels.length)

	var xScale = d3.scaleLinear().range([height,0]).domain([0,Infinity]),
		xAxis = d3.axisLeft().scale(xScale)

	var data = dataForD3(height, rawData, scaleEgdes)

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
			.call(xAxis)
}


function updateBarchart(rawData, scaleEgdes){
	var height = 210;
	var barWidth = 30;
	var data = dataForD3(height, rawData, scaleEgdes)
	var types = ['S', 'N', 'R', 'M', 'K', 'G', 'F', 'A', 'B', 'O', 'W']

	d3.selectAll(".bar").remove();

	
	
	var tooltip = d3.select("#barchart").append("div")
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
					console.log(types[Math.round(d["value"]/height * labels.length) - 1])
					tooltip.html("This star is of type: " + types[Math.round(d["value"]/height * labels.length) - 1] )
							.style("opacity", .9)
							.style("left", 555 + d["x"] + "px")
		            		.style("top", height + 35 - d["value"] + "px")
		            		.style("display", "inline-block")}
				else{
					tooltip.html("This is " + Math.round(d["value"] * 10000 / height)/100 + " % of the maximum")
						.style("opacity", .9)
						.style("left", 520 + d["x"] + "px")
	            		.style("top", height + 35 - d["value"] + "px")
	            		.style("display", "inline-block") }})
			.on("mouseout", function(){tooltip.style("opacity", 0)})



}

function dataForD3(maxLength, rawData, scaleEgdes){

	labels = document.getElementsByClassName("barLabel")
	d3Data = []
	for (var i = 0; i < labels.length; i++){

		data = {"id": labels[i]["id"], "x": labels[i]["x"]["animVal"][0]["value"] - 25, 
				"value":  (Number(rawData[String(labels[i]["id"])]) - scaleEgdes[String(labels[i]["id"])]["min"])
					* (maxLength / (scaleEgdes[String(labels[i]["id"])]["max"] - scaleEgdes[String(labels[i]["id"])]["min"]))}

		d3Data.push(data)

	}
	return d3Data
}