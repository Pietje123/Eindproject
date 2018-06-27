function makeDropdown(labels, data, scaleEdges){
	var axes = ["x", "y"]
	axes.forEach(function(axis){
		var div = d3.select("#dropdown").append("div")
		
		div.append("text").text("The current " + axis + " variable is: ").style("font-size", "13px")
		var dropdown = div.append("div")
						.attr("class","dropdown").attr("id", axis + "Dropdown")
		dropdown.append("button").attr("class", "btn btn-primary dropdown-toggle")
						.attr("data-toggle", "dropdown").text("#").attr("id", axis + "Button")

		dropdown.append("div").attr("class", "dropdown-menu").selectAll("a")
							.data(labels).enter()
							.append("a").attr("class", "dropdown-item")
							.text(function (d) { return d; })
							.on("click", function(d){
								 $("#"+ axis +"Button").text(d) 
								changeDropdown(data, scaleEdges)});
	})
	$("#xButton").text("ColorIndex")
	$("#yButton").text("AbsMagnitude")
}

function changeDropdown(data, scaleEdges) {
	var labels = getLabelsScatterplot();
	var xLabel = labels[0];
	var yLabel = labels[1];
	var colourIndex = scaleEdges["ColorIndex"]
	changeLabelsInText(xLabel,yLabel)
	
	var amountOfStars = Number($(".parameter-value").text())
	if (amountOfStars < 1000){
		var data = data.slice(0,amountOfStars)
		var scaleEdges = getMinMax(data,labels)
	}

	updateScatter(data, scaleEdges, xLabel, yLabel, colourIndex)
	
};