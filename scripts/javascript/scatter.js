/*
This function make a scatterplot and updates it

used sites:
http://bl.ocks.org/weiglemc/6185069
https://stackoverflow.com/questions/38450349/uncaught-typeerror-cannot-read-property-linear-of-undefined
https://keithpblog.org/post/upgrading-d3-from-v3-to-v4/.

made by

Alwan Rashid (10580204)

*/

/*
This function makes a scatterplot

@data {JSON array} arg Data
@scaleEdges {JSON} arg Minimum and maximum value of rawData
No return 
*/

function makeScatter(data, scaleEdges){

    var margin = {top: 40, right: 20, bottom: 50, left: 80},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var xLabel = "ColorIndex";
    var yLabel = "AbsMagnitude";

    

    var xValue = function(d) { return Number(d[xLabel]);}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

    var yValue = function(d) { return Number(d[yLabel]);}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

    // for the colour of the dots
    var sequentialScale = d3.scaleSequential()
                              .domain([scaleEdges[xLabel]["max"], scaleEdges[xLabel]["min"]])
                              .interpolator(d3.interpolateRainbow);

      // make the bar and radar chart
      // couldn't do it in the main since it needed the colorcode
    makeBarchart(data[0], scaleEdges, sequentialScale(data[0]["ColorIndex"]));
    makeRadarChart(data[0], scaleEdges, sequentialScale(data[0]["ColorIndex"]));


    // can't go in function because of async of js
    var starString = $("#barchartTitle").text().split(" ");
    var StarID = starString[starString.length - 1];

    // add svg at right position
    var svg = d3.select("#scatter")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add tooltip
    var tooltip = d3.select("#scatter")
                    .append("div")
                    .attr("class", "tooltip")
                    .attr("id", "scatterTooltip")
                    .style("opacity", 0);


    xScale.domain([d3.min(data, xValue)-0.1, d3.max(data, xValue)+0.1]);
    yScale.domain([d3.min(data, yValue)-0.1, d3.max(data, yValue)+0.1]);
    var title = yLabel + " vs " + xLabel;

    // x-axis
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.ticks(9).tickFormat(d3.format(".1e")));

    // title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .text(title);

    // y axis
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis.ticks(9).tickFormat(d3.format(".1e")));

    // add the dots    
    svg.selectAll(".star")
        .data(data)
        .enter().append("circle")
        .attr("class", "star")
        .attr("id", function(d){ 
            return d["StarID"];
        })
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d){

            return sequentialScale(d["ColorIndex"]);
        })
        .on("mouseover", function(d){

            d3.select(this).attr("r", 10);
            showTooltipScatterplot(d);
        })
        .on("mouseout", function(d){

            d3.select(this).attr("r", 2);
            hideTooltip("scatter");
        })
        .on("click", function(d){

            // scroll down to the charts
            $("html, body").animate({
                scrollTop: $("#barchart").offset().top - 
                        $("nav").outerHeight()}, "slow")
                // only do if scrolling is done
                .promise().done(function(){
                    
                // can't go in function because of async of js
                var starString = $("#barchartTitle").text().split(" ");
                var StarID = starString[starString.length - 1];

                $("#starIdNumber").text(d["StarID"])
                changeStarColour(StarID,sequentialScale(data[StarID -1]["ColorIndex"]));
                updateBarchart(d, scaleEdges, sequentialScale(d["ColorIndex"]));
                updateRadarChart(d, scaleEdges, sequentialScale(d["ColorIndex"]));
                changeStarColour(d["StarID"], "black");
            });
        });
    // change the currently selected star to black
    changeStarColour(StarID, "black");
};

/*
This function updates the scatterplot

@data {JSON array} arg Data
@scaleEdges {JSON} arg Minimum and maximum value of rawData
@xLabel {string} arg xLabel of scatterplot
@yLabel {string} arg yLabel of scatterplot
@colourScale {d3object} arg it is to give a colour within a range
No return 
*/

function updateScatter(data, scaleEdges, xLabel, yLabel, colourScale){
    
    d3.select("#title")
        .remove();

    // can't go in function because of async of js
    var starString = $("#barchartTitle").text().split(" ")
    var StarID = starString[starString.length - 1]

    var margin = {top: 40, right: 20, bottom: 50, left: 80},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var xValue = function(d) { return Number(d[xLabel]);}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

    var yValue = function(d) { return Number(d[yLabel]);}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

    xScale.domain([scaleEdges[xLabel]["min"] - 0.1,  scaleEdges[xLabel]["max"] + 0.1]);
    yScale.domain([scaleEdges[yLabel]["min"] - 0.1, scaleEdges[yLabel]["max"] + 0.1]);

    var sequentialScale = d3.scaleSequential()
                                .domain([colourScale["max"], colourScale["min"]])
                                .interpolator(d3.interpolateRainbow);

    var title = yLabel + " vs " + xLabel;

    // update the stars with transitions
    var    stars = d3.selectAll(".star")
                    .data(data)
                    .on("mouseover", function(d){
                        d3.select(this).attr("r", 10);
                        showTooltipScatterplot(d);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).attr("r", 2);
                        hideTooltip("scatter");
                    })
                    .on("click", function(d){
                        $("html, body").animate({
                            scrollTop: $("#barchart").offset().top 
                                    - $("nav").outerHeight()}, "slow")
                            .promise().done(function(){

                                // can't go in function because of async of js
                                var starString = $("#barchartTitle").text().split(" ");
                                var StarID = starString[starString.length - 1];

                                $("#starIdNumber").text(d["StarID"])
                                changeStarColour(StarID, 
                                        sequentialScale(data[StarID - 1]["ColorIndex"]));
                                updateBarchart(d, scaleEdges, sequentialScale(d["ColorIndex"]));
                                updateRadarChart(d, scaleEdges, sequentialScale(d["ColorIndex"]));
                                changeStarColour(d["StarID"], "black");

                        })
                    });

    stars.transition()
            .duration(1000)
            .attr("class", "star")
            .attr("r", 2)
            .attr("cx", xMap).attr("cy", yMap)
            .style("opacity", function(d){
                // only make the plotted stars visible and not the dummystars
                if (Object.keys(d).length > 2){    
                    return 1;
                }
                else {
                    return 0;
                }
            });

    // add title
    d3.select("g")
        .append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .attr("id", "title")
        .text(title);

    // update x axis
    d3.select(".xAxis")
        .transition()
        .duration(1000)
        .call(xAxis.ticks(9).tickFormat(d3.format(".1e")));

    // update y axis
    d3.select(".yAxis")
        .transition()
        .duration(1000)
        .call(yAxis.ticks(9).tickFormat(d3.format(".1e")));

}