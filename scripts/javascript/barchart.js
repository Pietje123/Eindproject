/*
This script makes a barchart and updates it using transitions
made by 
Alwan Rashid (10580204)
*/

/*
This function makes a barchart with bars in a colour

@rawData {JSON array} arg Data
@scaleEdges {JSON} arg Minimum and maximum value of rawData
@colour {RGB value} arg colour of the bars
No return
*/

function makeBarchart(rawData, scaleEdges, colour){

    var labels = ["Temperature","Spectrum","AbsMagnitude","Velocity", "ColorIndex"];

    var margin = {top: 40, right: 20, bottom: 50, left: 50},
        width = labels.length * 100 - margin.left - margin.right,
        height = labels.length * 80 - margin.top - margin.bottom;
    var barWidth = width / (labels.length * 2);

    // make the x-axis 
    var xScale = d3.scaleLinear().range([height,0]).domain([0,1]),
        xAxis = d3.axisLeft().scale(xScale);

    // make the tooltip
    var tooltip = d3.select("#barchart")
                    .append("div")
                    .attr("id", "barTooltip")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    // add the svg on which the bar chart is placed
    var svg = d3.select("#barchart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add labels
    svg.selectAll("text.axis")
        .data(labels)
        .enter()
        .append("text")
        .attr("class","barLabel")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "13px")
        .attr("y", margin.bottom / 2)
        .attr("id", function(d){
             return d.split(' ').join('')
            })
        .attr("x", function(d,i){
                return (width  - (i + .5) * barWidth * 2)
            })
        .text(function(d){
            return d 
            })
        .attr("text-anchor", "middle");

    // add the title
    svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("id", "barchartTitle")
        .text("Data of star number " + rawData["StarID"]);

    // add the bar
    svg.append("g")
        .attr("class", "axis tick")
        .attr("transform", "translate(" + (margin.left / 2) + ",0)")
        .call(xAxis.tickFormat(d3.format(".0%")));

    // alter data so it's easier to put in a barchart
    var data = dataForD3(height, rawData, scaleEdges, "bar");

    // add the bars
    var bars = d3.select("#barchart")
                    .select("svg")
                    .select("g")
                    .selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("fill", colour)
                    .attr("stroke", colour)
                    .attr("transform", "translate(0," + height + ")")
                    .attr("id",  function(d){
                        return "bar" + d["id"]
                    })
                    .attr("class","bar")
                    .attr("y",  function(d){
                        return - Math.abs(d["value"])
                    })
                    .attr("x", function(d){
                        return d["x"] - barWidth / 3
                    })
                    .attr("height", function(d){
                        return Math.abs(d["value"])
                    })
                    .attr("width", barWidth)
                    .attr("class", "bar")
                    .on("mouseover", function(d){
                        showTooltip(d, rawData, "bar")
                    })
                    .on("mouseout", function(d){
                        hideTooltip("bar")
                    });
};

/*
This function updates the bars of the previous function

@rawData {JSON array} arg Data
@scaleEdges {JSON} arg Minimum and maximum value of rawData
@colour {RGB value} arg colour of the bars
No return
*/

function updateBarchart(rawData, scaleEdges, colour){

    var barWidth = document.getElementById("barAbsMagnitude").getAttribute("width");
    var dimensions = getDimensionsFromTranslation(document.getElementById("barAbsMagnitude"));
    var width = dimensions[0],
        height = dimensions[1];

    // alter data so it's easier to put in a barchart
    var data = dataForD3(height, rawData, scaleEdges, "bar");

    // change the title
    $("#barchartTitle").html("Data of star number " + rawData["StarID"]);
    
    // select the bars and add mouseover/mouseout
    var    bars = d3.selectAll(".bar")
                    .data(data)
                    .on("mouseover", function(d){
                        showTooltip(d, rawData, "bar")
                    })
                    .on("mouseout", function(d){
                        hideTooltip("bar")
                    });

    // alter bars and add transition    
    bars.transition()
        .duration(1000)
        .attr("fill", colour)
        .attr("stroke", colour)
        .attr("transform", "translate(0," + height + ")")
        .attr("class","bar")
        .attr("y",  function(d){
            return - Math.abs(d["value"])
        })
        .attr("x", function(d){
            return d["x"] - barWidth / 3
        })
        .attr("height", function(d){
            return Math.abs(d["value"])
        })
        .attr("width", barWidth).attr("class", "bar");
};
