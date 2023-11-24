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
            { category: 'Recreational'
                , change: calculateMarketValueChange(vis.data, "rec_cult") },
            { category: 'Household Furnishings'
                , change: calculateMarketValueChange(vis.data, "household_expenditures") },
            { category: 'Household Appliances'
                , change: calculateMarketValueChange(vis.data, "household_appliances") },
            { category: 'Household Garden Tools and Equipment'
                , change: calculateMarketValueChange(vis.data, "household_outdoor") },
            { category: 'Housing Maintenance and Repairs'
                , change: calculateMarketValueChange(vis.data, "housing_maintenance") },
        ];

        console.log("vis.market_change_data: ", vis.market_change_data)

        vis.margin = { top: 40, right: 20, bottom: 60, left: 225 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 662.5 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .range([vis.height, 0]).padding(0.1);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            // .ticks(13);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // TODO might need to move this down to updatevis later? or maybe it's fine here...
        // Scale the range of the data
        // think about vis.x, may need to set some kind of static domain like [-100, 100]
        // vis.x.domain([d3.min(vis.market_change_data, d => d.change), d3.max(vis.market_change_data, d => d.change)]);
        vis.x.domain([-3000, 3000])
        vis.y.domain(vis.market_change_data.map(d => d.category));

        // Draw the bars
        vis.svg.selectAll(".bar")
            .data(vis.market_change_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", d => vis.y(d.category))
            .attr("height", vis.y.bandwidth())
            .attr("x", d => (d.change >= 0) ? vis.x(0) : vis.x(d.change))  // This code helps us get the bars to start at the 0 line
            .attr("width", d => Math.abs(vis.x(0) - vis.x(d.change)));  


        vis.market_change_data.forEach(function (d) {
            console.log("d.category: ", d.category)
            console.log("width: ", vis.x(d.change))
        })

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