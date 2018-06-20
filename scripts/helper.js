
function dataForD3(maxLength, rawData, scaleEdges, plot){

	var labels = document.getElementsByClassName(plot + "Label")
	var d3Data = []
	for (var i = 0; i < labels.length; i++){


		data = {"id": labels[i]["id"], "x": labels[i].getAttribute("x"),

				// yNew = (yOld - yMinOld) / (yMaxOld - yMinOld) * (YMaxNew - YMinNew = 0) 
				"value":  (Number(rawData[String(labels[i]["id"])]) - scaleEdges[String(labels[i]["id"])]["min"])
					/ (scaleEdges[String(labels[i]["id"])]["max"] - scaleEdges[String(labels[i]["id"])]["min"])
						* maxLength
				}

		d3Data.push(data)
	}
	return d3Data
}

function getMinMax(data, labels){
	var scaleEdges = {}

	labels.forEach(function(label){
		let max = Math.max.apply(Math,data.map(function(d){return d[label];}))
		let min = Math.min.apply(Math,data.map(function(d){return d[label];}))
		if (label == "AbsMagnitude" || label == "Magnitude"){
			max, min = min, max
		}
		scaleEdges[label] = {"min": min, "max": max}
	})

	return scaleEdges
}


function makeCoordinatesForPolygon(data){
	var coordinates = []
	for (i = 0; i < data.length; i++){
		let x = data[i]["value"] * Math.cos((i + 1) * 2 * Math.PI / data.length)
		let y = data[i]["value"] * Math.sin((i + 1) * 2 * Math.PI / data.length) 
		coordinates.push({"x": x  , "y": y, "id": data[i]["id"]})
	}
	return coordinates
	
}

function showTooltip(dot, rawData, plot){

	var types = ["S", "N", "R", "M", "K", "G", "F", "A", "B", "O", "W"]

	var title;


	switch(dot["id"]){
		case "Distance":
			title = "The distance to this star is: " + rawData[dot["id"]].toExponential(2) + " km";
			break;

		case "Time":
			title = "It would take " + rawData[dot["id"]].toExponential(2) + " years to go to this star";
			break;

		case "Magnitude":
			title = "The magnitude of this star is " + rawData[dot["id"]] + ". This means the sun is \
					about " + (10 ** (0.4 * rawData[dot["id"]] + 26.74)).toExponential(2) + " as bright in \
					our sky";
			break;

		case "Gas":
			title = "It would take about " + rawData[dot["id"]].toExponential(2) + " liters of gas to get to \
					this star";
			break;

		case "Spectrum":
			title = "The type of this star is " +  types[rawData[dot["id"]] - 1];
			break;

		case "AbsMagnitude":
			title = "This star was an absolute magnitude of " + Number(rawData[dot["id"]]).toFixed(2) + 
					". This means it is about " + (100 ** ((rawData[dot["id"]] - 4.83)/ 5)).toExponential(2) 
					+ " times more luminous as the sun at a distance of 32.61 light years";
			break;

		case "Velocity":
			title = "This star moves at a speed of " + Number(rawData[dot["id"]]).toFixed(2) + " km/s away from us";
			break;

		case "ColorIndex":
			title = "This is an index ratio between how much blue and visual light comes from this\
					star, the ratio for this star is " + rawData[dot["id"]];
			break;

		case "Temperature":
			title = "The temperature of this star is " 
					+ (Number(rawData[dot["id"]]) - 273.15).toExponential(2) + " degrees Celsius"
			break;

		default:
			title = "The number of this star is " + dot["StarID"]
	}

	if (plot == "scatter"){
		
		var dx = -110;
		var dy = -60;
	}
	else {

		var dx = 10;
		var dy = -70;
	}

	d3.select("#" + plot + "Tooltip").html(title)
		.style("opacity", .9)
		.style("left", d3.event.layerX  + dx + "px")
		.style("top", d3.event.layerY + dy + "px")
		.style("display", "inline-block")
	
}


function hideTooltip(plot){

	d3.select("#" + plot + "Tooltip")
		.style("opacity", 0)
		.style("left", 0 + "px")
		.style("top", 0 + "px")
		.style("display", "inline-block")
}

function getDimensionsFromTranslation(element){

	var elements = element.getAttribute("transform").split(",")
	var width, height;
	for (let i = 0; i < elements[0].length; i++){
		if (Number(elements[0][i]) != NaN){
			width = elements[0].slice(i)
		}
	}


	for (let i = 0; i < elements[1].length; i++){
		if (elements[1][i] == ")"){
			height = elements[1].slice(0,i)
		}

	}
	return [width, height]
}

function getLabels(data){
	var labels = Object.keys(data);
	labels.splice( labels.indexOf("StarID"), 1 );

	return labels
}


function makeDropdown(labels, data, scaleEdges){
	var axes = ["x", "y"]
	axes.forEach(function(axis){
		var select = d3.select("#dropdown")
						.append("select")
						.attr("class","select").attr("id", axis + "Dropdown")
						.on("change", function(){ 
							onChangeDropdown(data, scaleEdges)})

		var options = select.selectAll("option")
							.data(labels).enter()
							.append("option")
							.text(function (d) { return d; });
	})
}

function onChangeDropdown(data, scaleEdges) {
	var xLabel = $("#xDropdown :selected").text();
	var yLabel = $("#yDropdown :selected").text();
	updateScatter(data, scaleEdges, xLabel, yLabel)
	
};