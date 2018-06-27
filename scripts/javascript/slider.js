function makeSlider(data, scaleEdges){
	var maxStars = data.length

	var slider = d3.sliderHorizontal()
			    .min(0)
			    .max(maxStars)
			    .width(200)
			    // .tickFormat(d3.format('.2%'))
			    .ticks(5)
			    .default(1000)
			    .on('onchange', function(d){
			    				sliderUpdatePlots(data.slice(0, Math.round(d)), maxStars - Math.round(d),
			    					scaleEdges["ColorIndex"])
			    				$("#AmountOfStars").text(d)
			    		});

  var g = d3.select("#slider").append("svg")
    .attr("width", 300)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

  g.call(slider);

  d3.select("#reset").on("click", function(){
  		slider.value(1000)
		$("html, body").animate({
        	scrollTop: $("#Scatterplot").offset().top 
        		- $("nav").outerHeight()}, "slow")
  	});

};

function sliderUpdatePlots(data, otherStarsInt, colourIndex){
	var scatterLabels = getLabelsScatterplot()

	var xLabel = String(scatterLabels[0])
	var yLabel = String(scatterLabels[1])
	var lastVisibleStar = Number(data[data.length -1 ]["StarID"])
	var allLabels = getLabels(data[0])
	var scaleEdges = getMinMax(data, allLabels)
	for (let i = 0; i < otherStarsInt; i++)
	{
		let dummyStar = {};
		dummyStar[xLabel] = scaleEdges[xLabel]["min"] 
		dummyStar[yLabel] = scaleEdges[yLabel]["min"]
		data.push(dummyStar)

	}

	updateScatter(data, scaleEdges, xLabel, yLabel, colourIndex)

};