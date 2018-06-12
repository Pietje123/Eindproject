function makeScatter(data){


	var margin = {top: 40, right: 20, bottom: 50, left: 40},
		width = 600 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	yLabel = "AbsMagnitude"
	xLabel = "ColorIndex"

	var xValue = function(d) { return Number(d[xLabel]);}, // data -> value
		xScale = d3.scaleLinear().range([0, width]), // value -> display
		xMap = function(d) { return xScale(xValue(d));}, // data -> display
		xAxis = d3.axisBottom().scale(xScale);

	var yValue = function(d) { return Number(d[yLabel]);}, // data -> value
		yScale = d3.scaleLinear().range([height, 0]), // value -> display
		yMap = function(d) { return yScale(yValue(d));}, // data -> display
		yAxis = d3.axisLeft().scale(yScale);

	console.log(d3.min(data, function(d){
		return Number(d["AbsMagnitude"])
	}))
	var sequentialScale = d3.scaleSequential()
  							.domain([d3.max(data, xValue), d3.min(data, xValue)])
  							.interpolator(d3.interpolateRainbow);
	var svg = d3.select("#scatter").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tooltip = d3.select("#scatter").append("div")
				      .attr("class", "tooltip")
				      .style("opacity", 0);

	xScale.domain([d3.min(data, xValue)-0.1, d3.max(data, xValue)+0.1]);
	yScale.domain([d3.max(data, yValue)+0.1, d3.min(data, yValue)-0.1]);
	var title = yLabel + " vs " + xLabel
	// x-axis

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width - 5)
		.attr("y", -3)
		.style("text-anchor", "end")
		.text(xLabel)
		.style("fill","black");


	// title
	svg.append("text")
		.attr("x", (width / 2))
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.style("text-decoration", "underline")
		.text(title);

	// y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y",5)
		.attr("x", -3)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yLabel)
		.style("fill","black")

	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "star")
		.attr("r", 1)
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("fill", function(d){
			return sequentialScale(d[xLabel])
		})
		.on("mouseover", function(d){
			d3.select(this).attr("r", 10)
			if (d["ProperName"] != "") {
			let title = "The name of this star is " + d["ProperName"]
			tooltip.html(title)
			.style("left", (d3.event.pageX) + "px")
			.style("opacity", .9)
			.style("top", (d3.event.pageY) + "px");
			}
			else {
			let title = "The number of this star is " + d["StarID"]
			tooltip.html(title)
					.style("opacity", .9)
					.style("left", d3.event.pageX - 110 + "px")
            		.style("top", d3.event.pageY - 60 + "px")
            		.style("display", "inline-block")
			}
		})
		.on("mouseout", function(d){
			d3.select(this).attr("r", 1)
			tooltip.style("opacity", 0)
		})
		.on("click", function(d){
			updateBarchart(d);
		})
}