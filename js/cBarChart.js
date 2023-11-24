class cBarChart {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        // this.eventHandler = _eventHandler;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Get market change values
        // total_consumer_spending
        //
        // personal_gs
        // food_bev
        // health_gs
        // medical_products
        //
        // restaurants_hotels
        // eating_out
        // clothing
        // rec_cult
        //
        // household_expenditures
        // household_appliances
        // household_outdoor
        // housing_maintenance

        // Create a new dataset with just these market change values
        vis.market_change_data = [
            { category: 'Total Consumer Spending'
                , change: calculateMarketValueChange(vis.data, "total_consumer_spending") },
            { category: 'Personal Care Goods and Services'
                , change: calculateMarketValueChange(vis.data, "personal_gs") },
            { category: 'Food and Non-Alcoholic Beverages'
                , change: calculateMarketValueChange(vis.data, "food_bev") },
            { category: 'Health Goods and Services'
                , change: calculateMarketValueChange(vis.data, "health_gs") },
            { category: 'Medical Products'
                , change: calculateMarketValueChange(vis.data, "medical_products") },
            { category: 'Travel and Hotels'
                , change: calculateMarketValueChange(vis.data, "restaurants_hotels") },
            { category: 'Eating Out'
                , change: calculateMarketValueChange(vis.data, "eating_out") },
            { category: 'Clothing and Footwear'
                , change: calculateMarketValueChange(vis.data, "clothing") },
            { category: 'Residential Sales Price Index'
                , change: calculateMarketValueChange(vis.data, "rec_cult") },
            { category: 'Residential Sales Price Index'
                , change: calculateMarketValueChange(vis.data, "household_expenditures") },
            { category: 'Residential Sales Price Index'
                , change: calculateMarketValueChange(vis.data, "household_appliances") },
            { category: 'Residential Sales Price Index'
                , change: calculateMarketValueChange(vis.data, "household_outdoor") },
            { category: 'Residential Sales Price Index'
                , change: calculateMarketValueChange(vis.data, "housing_maintenance") },
        ];

        console.log("vis.market_change_data: ", vis.market_change_data)

        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleBand()
            .range([0, vis.width]).padding(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(6);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // TODO might need to move this down to updatevis later? or maybe it's fine here...
        // Scale the range of the data
        vis.x.domain(vis.market_change_data.map(d => d.category));
        vis.y.domain([0, d3.max(vis.market_change_data, d => d.change)]);

        // Draw the bars
        vis.svg.selectAll(".bar")
            .data(vis.market_change_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.x(d.category))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(d.change))
            .attr("height", d => vis.height - vis.y(d.change));


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