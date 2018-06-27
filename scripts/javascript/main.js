/*
This is the main function for running the webpage.

Alwan Rashid (10580204)
*/


window.onload = function() {
/*
Before running all the functions first wait until 
all the data is loaded
*/
	d3.queue()
		.defer(d3.json, "data/jsonData.json")
		.awaitAll(main)

}

function main(error, response){
/*
After the data is loaded this function is called and runs the functions
*/
	var starData = response[0]
	var labels = getLabels(starData[0])
	var minMax = getMinMax(starData, labels)


	makeScatter(starData, minMax)
	makeSlider(starData, minMax)
	makeDropdown(labels, starData, minMax)
	navBarOnClick()
}




