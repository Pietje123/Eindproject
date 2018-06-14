window.onload = function() {
	d3.queue()
		.defer(d3.json, "data/jsonData.json")
		.awaitAll(main)

}

function main(error, response){
	var starData = response[0]
	
	makeScatter(starData, getMinMax(starData))
	makeBarchart(starData[0], getMinMax(starData))
}


function getMinMax(data){
	labels = ["AbsMagnitude","Spectrum","Velocity","ColorIndex"]
	scaleEgdes = "{"
	labels.forEach(function(label){
		max = Math.max.apply(Math,data.map(function(d){return d[label];}))
		min = Math.min.apply(Math,data.map(function(d){return d[label];}))
		scaleEgdes += "\"" + label + "\"" + ":{ \"max\":" + max + ",\"min\":" + min + "},"
	})
	return JSON.parse(scaleEgdes.slice(0,-1) + "}")
}

