export function drawBarChart(dataFile, cssContainer) {

    // Set the dimensions and margins of the graph
    const margin = {top: 10, right: 20, bottom: 20, left: 30},
        width = 600 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select(cssContainer)
        .append("svg")
        .classed("barchart-container", true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a function to draw the tooltip and line
    function drawTooltipAndLine() {
        // Define the tooltip
        const tooltip = d3.select(cssContainer).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "fixed");

        // Define the line
        const line = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("y1", height - 25)
            .attr("y2", height - 12)
            .style("display", "none");

        return { tooltip, line };
    }

    // Create stacked bar chart
    d3.csv(dataFile).then( function(data) {

        // List of subgroups ("struggling, ... , no entry")
        const subgroups = Object.keys(data[0]).slice(1);

        // Create scales: x and color
        const xScale = d3.scaleLinear().domain([0, 100]).range([ width, 0 ]);
        const colors = ["#b2182b","#ef8a62","#fddbc7","#67a9cf","#2166ac", "#2b2b2b"];

        // Stack data
        var stackGen = d3.stack().keys(subgroups).order(d3.stackOrderReverse);
        var stackedData = stackGen(data);

        // Create the tooltip and line
        const { tooltip, line } = drawTooltipAndLine();

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
            .attr("height", 40)
            .attr("stroke", "black")
            .attr("stroke-width", 0.)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("opacity", 0)
            .on("mouseover", function(d) {
                // Show the tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)

                const rectWidth = this.getBoundingClientRect().width;
                var category = d3.select(this.parentNode).datum().key;
                var value = (d[1] - d[0]).toFixed(2);
                const xPosition = xScale(d[1]);
                tooltip.html(category + ": " + value + "%")

                // Show the line
                line.attr("x1", xPosition + rectWidth/2)
                    .attr("x2", xPosition + rectWidth/2)
                    .style("display", "block")
            })
            .on("mousemove", function(d) {
                // Get the position of the corresponding rectangle
                const rectPosition = this.getBoundingClientRect();
                const leftPosition = rectPosition.left + rectPosition.width/2 - tooltip.node().getBoundingClientRect().width/2;

                // Move the tooltip to be under the rectangle
                tooltip
                    .style("left", leftPosition + "px")
                    .style("top", (rectPosition.bottom + 20) + "px");
            })
            .on("mouseout", function(d) {
                // Hide the tooltip and line
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                line.style("display", "none");
            })
            .transition()
            .duration(600)
            .style("opacity", 0.8);;
    })
}