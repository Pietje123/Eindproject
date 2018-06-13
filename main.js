window.onload = function() {
	d3.queue()
		.defer(d3.json, "data/jsonData.json")
		.awaitAll(main)

}

function main(error, response){
	var starData = response[0]
	
	makeScatter(starData, getMinMax(starData))
	makeBarchart()
}


function getMinMax(data){
	labels = ["AbsMagnitude","Magnitude","Velocity","ColorIndex"]
	scaleEgdes = "{"
	labels.forEach(function(label){
		max = Math.max.apply(Math,data.map(function(o){return o[label];}))
		min = Math.min.apply(Math,data.map(function(o){return o[label];}))
		scaleEgdes += "\"" + label + "\"" + ":{ \"max\":" + max + ",\"min\":" + min + "},"
	})
	return JSON.parse(scaleEgdes.slice(0,-1) + "}")
}

