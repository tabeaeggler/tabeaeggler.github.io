export function drawHeatMap(dataFile, cssContainer, showYAxis, title) {

    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 30, left: 70},
        width = 150,
        height = 150;

    // append the svg object to the body of the page
    const svg = d3.select(cssContainer)
        .append("svg")
        .attr("class", "heatmap-container-svg")
        .style("position", "relative")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv(dataFile).then(function(data) {

        // Labels of row and columns
        const myChanges = Array.from(new Set(data.map(d => d.change)))
        const myCategories = Array.from(new Set(data.map(d => d.category)))

        // Create scales: x, y and color
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(myChanges)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickFormat((d) => {
            if (d === "don’t know") {
                return "?";
            } else if (d === "increased a lot") {
                return "++";
            } else if (d === "increased a little") {
                return "+";
            } else if (d === "stayed the same") {
                return "=";
            } else if (d === "decreased a little") {
                return "-";
            } else if (d === "decreased a lot") {
                return "--";
            }
        }))
            .select(".domain").remove()

        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myCategories)
            .padding(0.05);

        if (showYAxis === "true") {
            svg.append("g")
                .style("font-size", 15)
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove()
        }

        const color = d3.scaleSequential()
            .interpolator(d3.interpolateReds) // interpolateRdBu
            .domain([1, 60]); // change domain to invert the scale

        // create a tooltip
        const tooltip = d3.select(cssContainer)
            .append("div")
            .attr("class", "tooltip-heatmap")
            .style("position", "fixed");

        // add the squares
        svg.selectAll()
            .data(data, function(d) {return d.change+':'+d.category;})
            .join("rect")
            .attr("x", function(d) { return x(d.change) })
            .attr("y", function(d) { return y(d.category) })
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return color(d.value)} )
            .style("stroke-width", 3)
            .style("stroke", "none")
            .style("opacity", 0)
            .on("mouseover", function(d) {
                tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("stroke", "#333")
                    .style("opacity", 1)
            })
            .on("mousemove", function(d) {
                let pos = d3.select(this).node().getBoundingClientRect();
                const formattedValue = parseFloat(d.value).toFixed(2);
                const colorValue = color(d.value);
                const fontColor = d3.lab(colorValue).l < 50 ? "white" : "black";
                const formattedValueWithMarker = `<span style="background-color: ${colorValue}; padding: 0 0.2em; border-radius: 0.2em; color: ${fontColor}; font-weight: bold;">${formattedValue}%</span>`;

                tooltip
                    .html(() => {
                        if (d.change === "don’t know") {
                            return `no entry for ${formattedValueWithMarker} of respondents`
                        } else {
                            return `${d.category} bills ${d.change} for ${formattedValueWithMarker} of respondents`
                        }
                    })
                    .style('left', `${(pos['x'])}px`)
                    .style('top', `${(pos['y'] + 30)}px`);
            })

            .on("mouseleave", function(d) {
                tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            })
            .transition()
            .duration(600)
            .style("opacity", 0.8);
    })

    // Add title to graph
    const titleText = svg.append("text")
        .attr("class", "title-heatmap")
        .attr("x", width / 2)
        .attr("y", 0 - 15)
        .style("opacity", 0) // Set initial opacity to 0 for fade-in effect
        .text(title);

    titleText.transition()
        .duration(600)
        .style("opacity", 1); // Set final opacity after transition
}