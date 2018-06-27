
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
	var dx = 10;
	var dy = -70;


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
					+ (Number(rawData[dot["id"]])).toExponential(2) + " degrees Kelvin"
			break;

		default:
			title = "Oops you broke something "
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
		.style("left", -1000 + "px")
		.style("top", -1000 + "px")
		.style("display", "inline-block")
}

function showTooltipScatterplot(data){
	var labels = getLabelsScatterplot();
	var xLabel = labels[0]
	var yLabel = labels[1]
	var title = "The number of this star is: " + data["StarID"] + ". The x coordinate (" +
				xLabel + ") is " + Number(data[xLabel]).toExponential(2) + ", the y coordinate (" 
				+ yLabel + ") is " + Number(data[yLabel]).toExponential(2)

	d3.select("#scatterTooltip").html(title)
		.style("opacity", .9)
		.style("left", d3.event.layerX - 200  + "px")
		.style("top", d3.event.layerY - 60 + "px")
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

function getLabelsScatterplot(){
	var xLabel = $("#xButton").text();
	var yLabel = $("#yButton").text();
	return [xLabel, yLabel]
}

function changeStarColour(id, colour){

	$("#" + id).css("fill", colour)
}


function getCurrentStar(){

	var starString = $("#barchartTitle").text().split(" ")
	return starString[starString.length - 1]

}

function makeDummyData(labels){
	var dummyStar = {}
	labels.forEach(function(label){
		dummyStar[label] = 0
	})
	return dummyStar
}

function navBarOnClick(){
	var navHeight = $("nav").outerHeight()
	$(function() {
		$('ul a').bind('click',function(event){
			var anchor = $(this);
			$("html, body").animate({
			        scrollTop: $("#" + anchor.text()).offset().top - navHeight}, "slow")
			event.preventDefault();
		});
	});
}


function changeLabelsInText(xLabel,yLabel){
	xLabel = addDimension(xLabel)
	yLabel = addDimension(yLabel)
	$("#xValue").text(xLabel[0])
	$("#yValue").text(yLabel[0])
	$("#xText").text(xLabel[1])
	$("#yText").text(yLabel[1])	
}

function addDimension(label){
	var text;
	switch(label){
		case "Temperature":
			text = "The temperature of a star is derived from its color index. A fun\
				fact is that cooler stars usually are red and as temperature increases the\
				star becomes more and more blue. "
			return [label + " (Kelvin) ", text]

		case "Gas":
			text = "Gas is the amount of gas a Fiat Panda (0.9TwinAir MT-5 63 kW/85 hp \
				4X4) driving at 100 km/h needs to travel the same distance as a \
				star is removed from Earth. As you can imagine this are astronomical numbers"
			return [label + " (liters) ", text]

		case "Distance":
			text = "The distance to the star is given in kilometers. This is normally\
				not a used unit in astronomy as most numbers are so huge. Usually the distances\
				are given in either lightyears (9.46 * 10^12 km) or in parsec (3.09 * 10^13 km)"
			return [label + " (kilometers)", text]

		case "Velocity":
			text = "The velocity of a star is not its actual velocity. It's the velocity\
				relative to us, but as we are also moving we can't pinpoint its exact velocity.\
				This velocity was calculated using the dopplereffect in lightwaves"
			return [label + " (kilometers per second)", text]

		case "Time": 
			text = "Time is the amount of years it would take a Fiat Panda (0.9TwinAir \
				MT-5 63 kW/85 hp 4X4) driving at 100 km/h to travel the distance \
				to the star. The fastest humans ever were the crew of Apollo 10, with a speed\
				of about 40.000 km/h. As you can see humankind needs to improve a lot to be \
				able to travel to star in one lifetime."
			return [label + " (years)", text]

		case "Spectrum":
			text = "The spectrum of a star is the type of a star. It's a rough estimate\
				for the temperature of a star. It was first introduced by Annie Cannon \
				at the start of the twentieth century. This system originally was a scale\
				for the temperature of the star, but in later years other types were added\
				which were not depended on temperature but on composition."
			return [label, text]

		case "AbsMagnitude":
			text = "The absolute magnitude (AbsMagnitude) is a way for astronomers\
                to compare different stars. It is a number to indicate the amount of light\
                one detects at a distance of 10 parsec (3.09 * 10^14 km)."
			return [label, text]

		case "Magnitude":
			text = "The magnitude of a star is a way to indicate the amount of light one can\
				detect on Earth. The magnitude is dependant on the mass, distance and temperature\
				of a star. It's a logarithmic scale, 1 point difference is about a factor 2.5 \
				more or less bright"
			return [label, text]

		case "ColorIndex":
			text = "There are multiple color indices, all of which are a ratio \
                between two intensities of light. This color index is the ratio between \
                blue light and visible light. Using the color index of a star astronomers \
                can approximate the temperature of that star."
			return [label, text]
	}
}