/*
This is a helper file to assist the main scripts
made by
Alwan Rashid (10580204)
*/

/*
Alter rawdata in to data relative to maxLength
and return it in a JSON

@maxLength {int} arg Integer to which the data needs to be scaled
@rawData {JSON array} arg Data
@scaleEdges {JSON} arg Minimum and maximum value of rawData
@plot {string} arg Of which plot it needs to get the labels
return {JSON} arg JSON with scaled values 
*/

function dataForD3(maxLength, rawData, scaleEdges, plot){

    // get the labels of the required plot
    var labels = document.getElementsByClassName(plot + "Label");
    var d3Data = [];

    // loop through all the labels
    for (var i = 0; i < labels.length; i++){

        // make json
        data = {"id": labels[i]["id"], "x": labels[i].getAttribute("x"),

                // yNew = (yOld - yMinOld) / (yMaxOld - yMinOld) * (YMaxNew - YMinNew = 0) 
                "value":  (Number(rawData[String(labels[i]["id"])]) - scaleEdges[String(labels[i]["id"])]["min"])
                    / (scaleEdges[String(labels[i]["id"])]["max"] - scaleEdges[String(labels[i]["id"])]["min"])
                        * maxLength
                };

        // add json to array
        d3Data.push(data);
    };
    return d3Data;
};

/*
This function puts the min / max of a json array and puts it in a json
with as keys the variable

@data {JSON array} arg Data
@labels {array} arg Of which the minimum and maximum data needs to searched
returns {JSON} arg Minimum and maximum values of data
*/

function getMinMax(data, labels){

    var scaleEdges = {};

    labels.forEach(function(label){
        // get max
        let max = Math.max.apply(Math,data.map(function(d){
                                        return d[label];
                                    })
                                );
        // get min
        let min = Math.min.apply(Math,data.map(function(d){
                                        return d[label];
                                    })
                                );
        // add it to json
        scaleEdges[label] = {"min": min, "max": max};
    });

    return scaleEdges;
};

/*
This function calculates the x and y coordinates of a regular polygon
and adds the label of that variable

@data {JSON array} arg Data
return {JSON array} arg Data to be used in a radarchart
*/

function makeCoordinatesForPolygon(data){

    var coordinates = []
    for (i = 0; i < data.length; i++){

        // unit circle
        let x = data[i]["value"] * Math.cos((i + 1) * 2 * Math.PI / data.length);
        let y = data[i]["value"] * Math.sin((i + 1) * 2 * Math.PI / data.length) ;

        // add to array
        coordinates.push({"x": x  , "y": y, "id": data[i]["id"]});
    };
    return coordinates;    
};

/*
This function makes the text for the tooltips of the bar and radar charts

@dot {JSON} arg Data from d3Data
@rawData {JSON array} arg Data
@plot {string} arg Of which plot it needs to get the labels
no return
*/

function showTooltip(dot, rawData, plot){

    var types = ["S", "N", "R", "M", "K", "G", "F", "A", "B", "O", "W"];

    var title;
    var dx = 10;
    var dy = -70;

    // huge switch statement because it has a different title for each id
    switch(dot["id"]){
        case "Distance":
            title = "The distance to this star is: " + rawData[dot["id"]].toExponential(2) + " km";
            break;

        case "Time":
            title = "It would take " + rawData[dot["id"]].toExponential(2) + " years to go to this star";
            break;

        case "Magnitude":
            title = "The magnitude of this star is " + rawData[dot["id"]] + ". This means the sun is \
                    about " + (10 ** (0.4 * rawData[dot["id"]] + 26.74)).toExponential(2) + " as bright in \
                    our sky";
            break;

        case "Gas":
            title = "It would take about " + rawData[dot["id"]].toExponential(2) + " liters of gas to get to \
                    this star";
            break;

        case "Spectrum":
            title = "The type of this star is " +  types[rawData[dot["id"]] - 1];
            break;

        case "AbsMagnitude":
            title = "This star was an absolute magnitude of " + Number(rawData[dot["id"]]).toFixed(2) + 
                    ". This means it is about " + (100 ** ((rawData[dot["id"]] - 4.83)/ 5)).toExponential(2) 
                    + " times more luminous as the sun at a distance of 32.61 light years";
            break;

        case "Velocity":
            title = "This star moves at a speed of " + Number(rawData[dot["id"]]).toFixed(2) + " km/s away from us";
            break;

        case "ColorIndex":
            title = "This is an index ratio between how much blue and visual light comes from this\
                    star, the ratio for this star is " + rawData[dot["id"]];
            break;

        case "Temperature":
            title = "The temperature of this star is " 
                    + (Number(rawData[dot["id"]])).toExponential(2) + " degrees Kelvin";
            break;

        // to check if it works properly everywhere
        default:
            title = "Oops you broke something ";
    };
    // change position of tooltip and make it visible
    d3.select("#" + plot + "Tooltip").html(title)
        .style("opacity", .9)
        .style("left", d3.event.layerX  + dx + "px")
        .style("top", d3.event.layerY + dy + "px")
        .style("display", "inline-block");
    
};

/*
This function hides the tooltip of the radar and bar charts

@plot {string} arg Of which plot it needs to get the labels
no return
*/  

function hideTooltip(plot){
  
    // change position and make it invisible
    d3.select("#" + plot + "Tooltip")
        .style("opacity", 0)
        .style("left", -1000 + "px")
        .style("top", -1000 + "px")
        .style("display", "inline-block");
};

/*
This function makes the text of the tooltip for the scatterplot

@data {JSON} arg Data
no return
*/

function showTooltipScatterplot(data){

    // get the current labels ofthe scatterplot
    var labels = getLabelsScatterplot();
    var xLabel = labels[0];
    var yLabel = labels[1];

    // change the title
    var title = "The number of this star is: " + data["StarID"] + ". The x coordinate (" +
                xLabel + ") is " + Number(data[xLabel]).toExponential(2) + ", the y coordinate (" 
                + yLabel + ") is " + Number(data[yLabel]).toExponential(2);

    // change position of tooltip and make it visible
    d3.select("#scatterTooltip").html(title)
        .style("opacity", .9)
        .style("left", d3.event.layerX - 200  + "px")
        .style("top", d3.event.layerY - 60 + "px")
        .style("display", "inline-block");
};

/*
This function get the width and height from a translation

translate(123,321) => [123,321]

@element {hmtlelement} arg This is htmlelement
return {array} 
*/

function getDimensionsFromTranslation(element){

    // get the transform and split it at "," 
    // returns a string
    var elements = element.getAttribute("transform").split(",")
    var width, height;

    // loops through the first string untill it finds a number 
    // then slice
    for (let i = 0; i < elements[0].length; i++){
        if (Number(elements[0][i]) != NaN){
            width = elements[0].slice(i);
        };
    };

    // loop through the second string untill it finds ")"
    // then slice
    for (let i = 0; i < elements[1].length; i++){
        if (elements[1][i] == ")"){
            height = elements[1].slice(0,i);
        };
    };
    return [width, height];
};

/*
This function gets the keys of an object and puts "StarID"
at the first spot

return {array} arg Keys of the data
*/

function getLabels(data){

    var labels = Object.keys(data);
    labels.splice( labels.indexOf("StarID"), 1 );

    return labels;
};

/*
This function gets the current labels of the scatterplot

return {array} arg With current labels of dropdownmenus
*/

function getLabelsScatterplot(){

    var xLabel = $("#xButton").text();
    var yLabel = $("#yButton").text();
    return [xLabel, yLabel];
};

/*
This function changes the colour of an html element using
its id

@id {string} arg Way to identify the element
@colour {RGB value} arg To have optional colour
no return
*/

function changeStarColour(id, colour){

    $("#" + id).css("fill", colour);
};

/*
This function gets the StarID of the currently shows data 
in the bar/radar chart

return {string}
*/

function getCurrentStar(){

    var starString = $("#barchartTitle").text().split(" ");
    return starString[starString.length - 1];

};

/*
This function scrolls to a specific id 

inspiration by
https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link/7717625
*/

function navBarOnClick(){

    // the top of the shown part is behind the navbar so it needs to scroll a bit further
    var navHeight = $("nav").outerHeight();
    $(function() {
        $('ul a').bind('click',function(event){
            var anchor = $(this);
            $("html, body").animate({
                    scrollTop: $("#" + anchor.text()).offset().top - navHeight}, "slow")
            event.preventDefault();
        });
    });
};

/*
This function changes the html page with new texts

@xLabel {string} arg xLabel of scatterplot
@yLabel {string} arg yLabel of scatterplot
no return
*/

function changeLabelsInText(xLabel,yLabel){

    xLabel = addDimensionAndText(xLabel);
    yLabel = addDimensionAndText(yLabel);
    $("#xValue").text(xLabel[0]);
    $("#yValue").text(yLabel[0]);
    $("#xText").text(xLabel[1]);
    $("#yText").text(yLabel[1]);
}

/*
This return a different unit and text for each label. This text is used for the html

@label {string} arg Label of something
return {array} arg [Label + unit, text]
*/

function addDimensionAndText(label){

    var text;
    switch(label){
        case "Temperature":
            text = "The temperature of a star is derived from its color index. A fun\
                fact is that cooler stars usually are red and as temperature increases the\
                star becomes more and more blue. ";
            return [label + " (Kelvin) ", text];

        case "Gas":
            text = "Gas is the amount of gas a Fiat Panda (0.9TwinAir MT-5 63 kW/85 hp \
                4X4) driving at 100 km/h needs to travel the same distance as a \
                star is removed from Earth. As you can imagine this are astronomical numbers";
            return [label + " (liters) ", text];

        case "Distance":
            text = "The distance to the star is given in kilometers. This is normally\
                not a used unit in astronomy as most numbers are so huge. Usually the distances\
                are given in either lightyears (9.46 * 10^12 km) or in parsec (3.09 * 10^13 km)";
            return [label + " (kilometers)", text];

        case "Velocity":
            text = "The velocity of a star is not its actual velocity. It's the velocity\
                relative to us, but as we are also moving we can't pinpoint its exact velocity.\
                This velocity was calculated using the dopplereffect in lightwaves";
            return [label + " (kilometers per second)", text];

        case "Time": 
            text = "Time is the amount of years it would take a Fiat Panda (0.9TwinAir \
                MT-5 63 kW/85 hp 4X4) driving at 100 km/h to travel the distance \
                to the star. The fastest humans ever were the crew of Apollo 10, with a speed\
                of about 40.000 km/h. As you can see humankind needs to improve a lot to be \
                able to travel to star in one lifetime.";
            return [label + " (years)", text];

        case "Spectrum":
            text = "The spectrum of a star is the type of a star. It's a rough estimate\
                for the temperature of a star. It was first introduced by Annie Cannon \
                at the start of the twentieth century. This system originally was a scale\
                for the temperature of the star, but in later years other types were added\
                which were not depended on temperature but on composition.";
            return [label, text];

        case "AbsMagnitude":
            text = "The absolute magnitude (AbsMagnitude) is a way for astronomers\
                to compare different stars. It is a number to indicate the amount of light\
                one detects at a distance of 10 parsec (3.09 * 10^14 km).";
            return [label, text];

        case "Magnitude":
            text = "The magnitude of a star is a way to indicate the amount of light one can\
                detect on Earth. The magnitude is dependant on the mass, distance and temperature\
                of a star. It's a logarithmic scale, 1 point difference is about a factor 2.5 \
                more or less bright";
            return [label, text];

        case "ColorIndex":
            text = "There are multiple color indices, all of which are a ratio \
                between two intensities of light. This color index is the ratio between \
                blue light and visible light. Using the color index of a star astronomers \
                can approximate the temperature of that star.";
            return [label, text];
    };
};