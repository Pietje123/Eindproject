window.onload = function() {
	d3.queue()
		.defer(d3.json, "data/jsonData.json")
		.awaitAll(main)

}

function main(error, response){
	var starData = response[0]
	var labels = getLabels(starData[0])
	var minMax = getMinMax(starData, labels)

	makeScatter(starData, minMax)
	makeBarchart(starData[0], minMax)
	makeRadarChart(starData[0], minMax)
	makeDropdown(labels, starData, minMax)
	makeSlider(starData.length)
}




