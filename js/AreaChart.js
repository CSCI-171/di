class AreaChart {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        // this.eventHandler = _eventHandler;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        vis.width = 400 - vis.margin.left - vis.margin.right,
            vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(6);

        // Set domains by finding the min and max of both the X and Y
        let minMaxX = d3.extent(vis.data.map(function (d) { return d.date; }));
        vis.x.domain(minMaxX);

        let minMaxY = [d3.min(vis.data.map(function (d) { return d.mortgage_rates; })),
                             d3.max(vis.data.map(function (d) { return d.mortgage_rates; }))];
        vis.y.domain(minMaxY);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // // Axis title
        // vis.svg.append("text")
        //     .attr("x", -50)
        //     .attr("y", -8)
        //     .text("Votes");

        // Append a path for the line
        vis.line = d3.line()
            .x(d => vis.x(d.date))
            .y(d => vis.y(d.mortgage_rates));

        vis.svg.append("path")
            .datum(vis.data)
            .attr("class", "line")
            .attr("d", vis.line);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        this.displayData = this.data;

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */

    updateVis() {
        let vis = this;

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    // onSelectionChange(selectionStart, selectionEnd) {
    // let vis = this;

    // Change the selected time range
    // d3.select("#time-period-min").text(dateFormatter(selectionStart));
    // d3.select("#time-period-max").text(dateFormatter(selectionEnd));

    // // Not sure why the other way didn't work, but this way works for me!
    // document.querySelector(".time-period-min").innerText = dateFormatter(selectionStart);
    // document.querySelector(".time-period-max").innerText = dateFormatter(selectionEnd);

    // }
}