// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%m/%d/%Y");

let promises = [
    d3.csv("data/macro.csv"),
    d3.csv("data/consumer.csv"),
    d3.csv("data/housing.csv"),
];

Promise.all(promises)
    .then(function (data) {
        // Rename the column in the first dataset only
        const renamedData = data.map(function (dataset, index) {
            if (index === 0) {
                return dataset.map(function (row) {
                    return {
                        date: dateParser(row['Date']),
                        // consumer_index: +row['Consumer price index'],
                        // consumption: +row['Consumption, private, real, LCU'],
                        // employment: +row['Employment, total'],
                        // gdp: +row['GDP, real, LCU'],
                        // interest_bank: +row['Interest rate, central bank policy'],
                        // interest_bond: +row['Interest rate, 10-Year Benchmark Bond Yield'],
                        // population: +row['Population, total'],
                        // unemployment: +row['Unemployment rate'],
                        gdp_yy_chg: +row['GDP, real, LCU, Y/Y %Chg'],

                    };
                });
            } else if (index === 1) {
                return dataset.map(function (row) {
                    return {
                        date: dateParser(row['Date']),
                        // alc_tob_narc: +row['Consumer spending, nominal, LCU - Alcoholic beverages, tobacco and narcotics - Total'],
                        clothing: +row['Consumer spending, nominal, LCU - Clothing and footwear - Total'],
                        eating_out: +row['Consumer spending, nominal, LCU - Eating out'],
                        // comms_gs: +row['Consumer spending, nominal, LCU - Communication goods and services - Total'],
                        // fin_serv: +row['Consumer spending, nominal, LCU - Financial services not elsewhere classified'],
                        food_bev: +row['Consumer spending, nominal, LCU - Food and non-alcoholic beverages - Total'],
                        // furniture: +row['Consumer spending, nominal, LCU - Furniture and furnishings, carpets and other floor coverings'],
                        health_gs: +row['Consumer spending, nominal, LCU - Health goods and services - Total'],
                        household_outdoor: +row['Consumer spending, nominal, LCU - Household and garden tools and equipment'],
                        household_appliances: +row['Consumer spending, nominal, LCU - Household appliances'],
                        household_expenditures: +row['Consumer spending, nominal, LCU - Household furnishings, household equipment and other housing expenditure - Total'],
                        // household_utensils: +row['Consumer spending, nominal, LCU - Household glassware, tableware and household utensils'],
                        // housing_electric_gas: +row['Consumer spending, nominal, LCU - Housing electricity, gas and other fuels'],
                        housing_maintenance: +row['Consumer spending, nominal, LCU - Housing maintenance and repairs'],
                        // housing_rent: +row['Consumer spending, nominal, LCU - Housing rent'],
                        // imputed_housing_rent: +row['Consumer spending, nominal, LCU - Imputed housing rent'],
                        medical_products: +row['Consumer spending, nominal, LCU - Medical products, appliances and equipment'],
                        // newspapers_books: +row['Consumer spending, nominal, LCU - Newspapers, books and stationery'],
                        // non_alc_beverages: +row['Consumer spending, nominal, LCU - Non-alcoholic beverages'],
                        // non_personal_transport: +row['Consumer spending, nominal, LCU - Non-personal transport services'],
                        // other_gs: +row['Consumer spending, nominal, LCU - Other goods and services - Total'],
                        // other_rec_cult: +row['Consumer spending, nominal, LCU - Other recreational and cultural durable goods'],
                        // other_rec: +row['Consumer spending, nominal, LCU - Other recreational items and equipment'],
                        personal_gs: +row['Consumer spending, nominal, LCU - Personal care goods and services'],
                        // personal_transport: +row['Consumer spending, nominal, LCU - Personal transport running costs'],
                        rec_cult: +row['Consumer spending, nominal, LCU - Recreational and cultural goods and services - Total'],
                        restaurants_hotels: +row['Consumer spending, nominal, LCU - Restaurants and hotels - Total'],
                        // household_gs: +row['Consumer spending, nominal, LCU - Routine household maintenance goods and services'],
                        // telephone_equip: +row['Consumer spending, nominal, LCU - Telephone equipment'],
                        // telephone_serv: +row['Consumer spending, nominal, LCU - Telephone services'],
                        total_consumer_spending: +row['Consumer spending, nominal, LCU - Total consumer spending'],
                        // transport_vehicles: +row['Consumer spending, nominal, LCU - Transport services and vehicle purchases - Total'],
                        // vehicles: +row['Consumer spending, nominal, LCU - Vehicle purchases']
                    }})
            } else if (index === 2) {
                    return dataset.map(function (row) {
                        return {
                            date: dateParser(row['Date']),
                            sale_price_index: +row['CREA Average Residential Sale Price Index'],
                            // housing_starts: +row['Housing starts'],
                            mortgage_rates: +row['Interest rate on fixed 5-year mortgages [%]'],
                            housing_market_value: +row['Market value of housing stock, LCU [C$; Millions]'],
                        }})
            } else {
                // For other datasets, keep them as they are
                return dataset;
            }
        });

        // Call createVis with the renamed data
        createVis(renamedData);
        // createVis(data);
    })
    .catch(function (err) {
        console.log(err)
    });


function createVis(data) {
    let macro_data = data[0]
    let consumer_data = data[1]
    let housing_data = data[2]

    console.log("macro_data: ", macro_data)
    console.log("consumer_data: ", consumer_data)
    console.log("housing_data: ", housing_data)

    let macroChart = new LineChart("macro_vis", macro_data)
    let consumerChart = new cBarChart("consumer_vis", consumer_data)
    let housingChart = new hBarChart("housing_vis", housing_data)
    let mortgageChart = new AreaChart("mortgage_vis", housing_data)
}


// there's no travel