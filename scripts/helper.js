


function dataForD3(maxLength, rawData, scaleEdges, plot){

	var labels = document.getElementsByClassName(plot + "Label")
	var d3Data = []
	for (var i = 0; i < labels.length; i++){
		console.log()
		data = {"id": labels[i]["id"], "x": labels[i].getBoundingClientRect().x + 15,

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
	var labels = ["AbsMagnitude","Spectrum","Velocity","ColorIndex","Distance", "Time", "Magnitude", "Gas"]
	var scaleEdges = "{"
	labels.forEach(function(label){
		max = Math.max.apply(Math,data.map(function(d){return d[label];}))
		min = Math.min.apply(Math,data.map(function(d){return d[label];}))
		if (label == "AbsMagnitude" || label == "Magnitude"){
			max, min = min, max
		}
		scaleEdges += "\"" + label + "\"" + ":{ \"max\":" + max + ",\"min\":" + min + "},"
	})

	return JSON.parse(scaleEdges.slice(0,-1) + "}")
}


function makeCoordinatesForPolygon(data){
	var coordinates = []
	for (i = 0; i < data.length; i++){
		x = data[i]["value"] * Math.cos((i + 1) * 2 * Math.PI / data.length)
		y = data[i]["value"] * Math.sin((i + 1) * 2 * Math.PI / data.length) 
		coordinates.push({"x": x  , "y": y})
	}
	return coordinates
	
}