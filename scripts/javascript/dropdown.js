/*
This script makes a dropdown menu using bootstrap

Alwan Rashid (10580204)
*/


function makeDropdown(labels, data, scaleEdges){
	var axes = ["x", "y"];
	axes.forEach(function(axis){

		// add div at appropriate locations
		var div = d3.select("#" + axis + "DropdownMenu")
					.append("div");
		
		// add text of the dropdown menu
		div.append("text")
			.text("The current " + axis + " variable is: ")
			.style("font-size", "13px");

		// add the dropdown
		var dropdown = div.append("div")
							.attr("class","dropdown")
							.attr("id", axis + "Dropdown");

		// add the button
		dropdown.append("button")
				.attr("class", "btn btn-primary dropdown-toggle")
				.attr("data-toggle", "dropdown")
				.text("#")
				.attr("id", axis + "Button");

		// add the buttons
		dropdown.append("div")
				.attr("class", "dropdown-menu")
				.selectAll("a")
				.data(labels)
				.enter()
				.append("a")
				.attr("class", "dropdown-item")
				.text(function (d) { 
					return d; 
				})
				.on("click", function(d){
					 $("#"+ axis +"Button").text(d) ;
					changeDropdown(data, scaleEdges);
				});
	});

	// set default values
	$("#xButton").text("ColorIndex");
	$("#yButton").text("AbsMagnitude");
};

function changeDropdown(data, scaleEdges) {
/*
This function manages the data so it can be put in the upgradeScatter function
*/

	var labels = getLabelsScatterplot();
	var xLabel = labels[0];
	var yLabel = labels[1];

	// get the appropriate colour
	var colourIndex = scaleEdges["ColorIndex"];
	changeLabelsInText(xLabel,yLabel);
	
	var amountOfStars = Number($(".parameter-value").text());

	// if the slider has been used, keep the same amount of stars
	if (amountOfStars < data.length){
		var data = data.slice(0,amountOfStars)
		var scaleEdges = getMinMax(data,labels)
	}

	updateScatter(data, scaleEdges, xLabel, yLabel, colourIndex)
	
};