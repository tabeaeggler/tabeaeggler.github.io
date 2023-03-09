// set the dimensions and margins of the graph
const margin = {top: 10, right: 20, bottom: 20, left: 30},
    width = 600 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// create stacked bar chart
d3.csv("./data/data_q1.csv").then( function(data) {

    // List of subgroups ("struggling, ... , no entry")
    const subgroups = Object.keys(data[0]).slice(1);

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([ width, 0 ]);

    // color palette = one color per subgroup
    const colors = ["#b2182b","#ef8a62","#fddbc7","#f7f7f7", "#d1e5f0","#67a9cf"];

    // stack data
    var stackGen = d3.stack()
        .keys(subgroups)
        .order(d3.stackOrderReverse);

    var stackedData = stackGen(data);

    console.log(stackedData)

    // Define the tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([height + 10, 0])
        .html(function(d) {
            return "<strong>Value: </strong> <span style='color:red'>" + (d[1] - d[0]) + "</span>";
        });


    // Show the bars
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", (d, i) => colors[i])
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d[1]))
        .attr("width", d => xScale(d[0]) - xScale(d[1]))
        .attr("height", 50)
        .attr("stroke", "black")
        .attr("stroke-width", 0.)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // Add the tooltip to the SVG
    svg.call(tip);
})
