function makeBarchart(){

	var labels = ["AbsMagnitude","Magnitude","Velocity","ColorIndex"];
	var scale = 0.45
	var margin = {top: 40, right: 20, bottom: 50, left: 40},
	width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	var barWidth = width / (labels.length)

	var xScale = d3.scaleLinear().range([height,0]).domain([0,Infinity]),
		xAxis = d3.axisLeft().scale(xScale)

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


function updateBarchart(rawData){

	var data = dataForD3(rawData)
	d3.selectAll(".bar").remove();

	var height = 410;
	
	if (rawData["ProperName"] != undefined){
		title = "The name of the current star is " + rawData["ProperName"]
 	}
 	else{
 		title = "The ID of is " + rawData["StarID"]
 	}

 	var svg = d3.select("#barchart").select("svg").select("g")

	svg.selectAll("rect").data(data).enter().append("rect")
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
		.attr("width", 50).attr("class", "bar")

}

function dataForD3(rawData){

	var maxLength = 410
	labels = document.getElementsByClassName("barLabel")
	d3Data = []
	var scaleEgdes =  {"AbsMagnitude": { "max": 14.2491649819126, "min" : -8.93},
					"ColorIndex": {"max":1.972, "min": -0.359},
					"Velocity": {"max": 24.58845628625393, "min": 0},
					"Magnitude": {"min": 12.81, "max": -26.73}}
	for (var i = 0; i < labels.length; i++){
		data = {"id": labels[i]["id"], "x": labels[i]["x"]["animVal"][0]["value"] - 25, 
				"value":  (Number(rawData[String(labels[i]["id"])]) - scaleEgdes[String(labels[i]["id"])]["min"])
					* (maxLength / (scaleEgdes[String(labels[i]["id"])]["max"] - scaleEgdes[String(labels[i]["id"])]["min"]))}

		d3Data.push(data)

	}
	return d3Data
}