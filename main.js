window.onload = function() {
	d3.queue()
		.defer(d3.json, "data/jsonData.json")
		.awaitAll(main)

}

function main(error, response){
	var starData = response

	makeScatter(starData[0])
	makeBarchart(starData[0][0])
}