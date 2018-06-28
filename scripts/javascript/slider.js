/*
This function makes a slider using:
https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

Alwan Rashid (10580204)
*/


function makeSlider(data, scaleEdges){
/*
This function makes a slider dependant on data
*/    
    // max of slider is length of data
    var maxStars = data.length

    var slider = d3.sliderHorizontal()
                    .min(0)
                    .max(maxStars)
                    .width(300)
                    .ticks(5)
                    .step(1)
                    .default(1000)
                    .on('onchange', function(d){
                                    sliderUpdateScatterplot(data.slice(0, d), maxStars - d,
                                        // get the appropiate colour
                                        scaleEdges["ColorIndex"])

                                    // change the number of the slider
                                    $("#AmountOfStars").text(d)
                            });

    var g = d3.select("#slider")
                  .append("svg")
                .attr("width", 400)
                .attr("height", 100)
                .append("g")
                .attr("transform", "translate(30,30)");

    g.call(slider);

      // when the reset is clicked, reset slider and scroll to scatterplot
    d3.select("#reset")
        .on("click", function(){
            slider.value(1000)
        $("html, body").animate({
            scrollTop: $("#Scatterplot").offset().top 
                - $("nav").outerHeight()}, "slow")
        });

};

function sliderUpdateScatterplot(data, otherStarsInt, colourIndex){
/*
This function updates the plots when the slider is changed
*/
    
    // get the current scatterplot labels
    var scatterLabels = getLabelsScatterplot();

    var xLabel = String(scatterLabels[0]);
    var yLabel = String(scatterLabels[1]);

    // recalculate the min / max of the data
    var allLabels = getLabels(data[0]);
    var scaleEdges = getMinMax(data, allLabels);

    // make dummy stars and set their data to the minimum
    // so these stars all converge to the same point
    // and are set invisible
    for (let i = 0; i < otherStarsInt; i++)
    {
        let dummyStar = {};
        dummyStar[xLabel] = scaleEdges[xLabel]["min"] ;
        dummyStar[yLabel] = scaleEdges[yLabel]["min"];
        data.push(dummyStar);

    }

    updateScatter(data, scaleEdges, xLabel, yLabel, colourIndex);

};