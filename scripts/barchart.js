function makeBarchart(){

	var labels = ["AbsMag","ColorIndex","Mag","Spectrum","Velocity"];
	var scale = 0.45
	var margin = {top: 40, right: 20, bottom: 50, left: 40},
	width = scale * window.innerWidth - margin.left - margin.right,
	height = scale * window.innerWidth - margin.top - margin.bottom;
	var barWidth = width / (labels.length + 1 )

	var xScale = d3.scaleLinear().range([0,width]).domain([0,100]),
		xAxis = d3.axisTop().scale(xScale)

	// add the svg on which the bar chart is placed
	var svg = d3.select("#barchart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add labels
	svg.selectAll("text.axis").data(labels).enter().append("text").attr("class","barLabel")
			.attr("x", - 10)
			.attr("y", function(d,i){
				return (height  - (i  + 0.5) * barWidth )
			}).text(function(d){return d}).attr("text-anchor", "end")
	
	// add the bars
	svg.append("g").attr("class", "axis tick")
			.attr("x", 0)
			.call(xAxis).append("text").attr("class","label")
}
