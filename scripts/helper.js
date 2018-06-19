
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

function getMinMax(data){
	var labels = ["AbsMagnitude","Spectrum","Velocity","ColorIndex","Distance", "Time", "Magnitude", "Gas", "Temperature"]
	var scaleEdges = {}
	labels.forEach(function(label){
		max = Math.max.apply(Math,data.map(function(d){return d[label];}))
		min = Math.min.apply(Math,data.map(function(d){return d[label];}))
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
		x = data[i]["value"] * Math.cos((i + 1) * 2 * Math.PI / data.length)
		y = data[i]["value"] * Math.sin((i + 1) * 2 * Math.PI / data.length) 
		coordinates.push({"x": x  , "y": y, "id": data[i]["id"]})
	}
	return coordinates
	
}

function showTooltip(dot, rawData, plot){

	var types = ['S', 'N', 'R', 'M', 'K', 'G', 'F', 'A', 'B', 'O', 'W']

	var title;


	switch(dot["id"]){
		case "Distance":
			title = "The distance to this star is: " + rawData[dot["id"]];
			break;

		case "Time":

			title = "It would take " + rawData[dot["id"]].toExponential(2) + " years to go to this star";
			break;

		case "Magnitude":
			title = "The magnitude of this star is " + rawData[dot["id"]] + ". The sun is \
					about " + (10 ** (0.4 * rawData[dot["id"]] + 26.74)).toExponential(2) + " as bright";
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
			title = "Oops you broke something"
	}

	d3.select("#" + plot + "Tooltip").html(title)
		.style("opacity", .9)
		.style("left", d3.event.pageX + "px")
		.style("top", d3.event.pageY + "px")
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

	for (let i = 0; i < elements[0].length; i++){
		if (Number(elements[0][i]) != NaN){
			var width = elements[0].slice(i)
		}
	}


	for (let i = 0; i < elements[1].length; i++){
		if (elements[1][i] == ")"){
			var height = elements[1].slice(0,i)
		}

	}
	return [width, height]
}