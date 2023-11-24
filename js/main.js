/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// Combined Global Variables
let myMap, myBrushVis, myRetail, myIndustrial, myMultifamily, myOffice;
let selectedTimeRange = [];
let selectedCategory;
let macroChart, consumerChart, housingChart, mortgageChart;

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%m/%d/%Y");

let promises = [
    d3.csv("data/macro.csv"),
    d3.csv("data/consumer.csv"),
    d3.csv("data/housing.csv"),
    d3.json("data/canada.topo.json"),
    d3.json("data/filtered_file.json"),
    d3.csv("data/IndustrialAvailability.csv"),
    d3.csv("data/OfficeVacancy.csv"),
    d3.csv("data/RentalRateGrowthMultifamily_modified.csv"),
    d3.csv("data/Retail.csv")
];


Promise.all(promises)
    .then(function (data) {
        initMainPage(data);
    })
    .catch(function (err) {
        console.error('Error loading data: ', err);
        // Display an error message to the user, or handle the error as appropriate.
    });

// Promise.all(promises)
//     .then(function (data) {
//         // Rename the column in the first dataset only
//         const renamedData = data.map(function (dataset, index) {
//             if (index === 0) {
//                 return dataset.map(function (row) {
//                     return {
//                         date: dateParser(row['Date']),
//                         // consumer_index: +row['Consumer price index'],
//                         // consumption: +row['Consumption, private, real, LCU'],
//                         // employment: +row['Employment, total'],
//                         // gdp: +row['GDP, real, LCU'],
//                         // interest_bank: +row['Interest rate, central bank policy'],
//                         // interest_bond: +row['Interest rate, 10-Year Benchmark Bond Yield'],
//                         // population: +row['Population, total'],
//                         // unemployment: +row['Unemployment rate'],
//                         gdp_yy_chg: +row['GDP, real, LCU, Y/Y %Chg'],
//
//                     };
//                 });
//             } else if (index === 1) {
//                 return dataset.map(function (row) {
//                     return {
//                         date: dateParser(row['Date']),
//                         // alc_tob_narc: +row['Consumer spending, nominal, LCU - Alcoholic beverages, tobacco and narcotics - Total'],
//                         clothing: +row['Consumer spending, nominal, LCU - Clothing and footwear - Total'],
//                         eating_out: +row['Consumer spending, nominal, LCU - Eating out'],
//                         // comms_gs: +row['Consumer spending, nominal, LCU - Communication goods and services - Total'],
//                         // fin_serv: +row['Consumer spending, nominal, LCU - Financial services not elsewhere classified'],
//                         food_bev: +row['Consumer spending, nominal, LCU - Food and non-alcoholic beverages - Total'],
//                         // furniture: +row['Consumer spending, nominal, LCU - Furniture and furnishings, carpets and other floor coverings'],
//                         health_gs: +row['Consumer spending, nominal, LCU - Health goods and services - Total'],
//                         household_outdoor: +row['Consumer spending, nominal, LCU - Household and garden tools and equipment'],
//                         household_appliances: +row['Consumer spending, nominal, LCU - Household appliances'],
//                         household_expenditures: +row['Consumer spending, nominal, LCU - Household furnishings, household equipment and other housing expenditure - Total'],
//                         // household_utensils: +row['Consumer spending, nominal, LCU - Household glassware, tableware and household utensils'],
//                         // housing_electric_gas: +row['Consumer spending, nominal, LCU - Housing electricity, gas and other fuels'],
//                         housing_maintenance: +row['Consumer spending, nominal, LCU - Housing maintenance and repairs'],
//                         // housing_rent: +row['Consumer spending, nominal, LCU - Housing rent'],
//                         // imputed_housing_rent: +row['Consumer spending, nominal, LCU - Imputed housing rent'],
//                         medical_products: +row['Consumer spending, nominal, LCU - Medical products, appliances and equipment'],
//                         // newspapers_books: +row['Consumer spending, nominal, LCU - Newspapers, books and stationery'],
//                         // non_alc_beverages: +row['Consumer spending, nominal, LCU - Non-alcoholic beverages'],
//                         // non_personal_transport: +row['Consumer spending, nominal, LCU - Non-personal transport services'],
//                         // other_gs: +row['Consumer spending, nominal, LCU - Other goods and services - Total'],
//                         // other_rec_cult: +row['Consumer spending, nominal, LCU - Other recreational and cultural durable goods'],
//                         // other_rec: +row['Consumer spending, nominal, LCU - Other recreational items and equipment'],
//                         personal_gs: +row['Consumer spending, nominal, LCU - Personal care goods and services'],
//                         // personal_transport: +row['Consumer spending, nominal, LCU - Personal transport running costs'],
//                         rec_cult: +row['Consumer spending, nominal, LCU - Recreational and cultural goods and services - Total'],
//                         restaurants_hotels: +row['Consumer spending, nominal, LCU - Restaurants and hotels - Total'],
//                         // household_gs: +row['Consumer spending, nominal, LCU - Routine household maintenance goods and services'],
//                         // telephone_equip: +row['Consumer spending, nominal, LCU - Telephone equipment'],
//                         // telephone_serv: +row['Consumer spending, nominal, LCU - Telephone services'],
//                         total_consumer_spending: +row['Consumer spending, nominal, LCU - Total consumer spending'],
//                         // transport_vehicles: +row['Consumer spending, nominal, LCU - Transport services and vehicle purchases - Total'],
//                         // vehicles: +row['Consumer spending, nominal, LCU - Vehicle purchases']
//                     }})
//             } else if (index === 2) {
//                 return dataset.map(function (row) {
//                     return {
//                         date: dateParser(row['Date']),
//                         sale_price_index: +row['CREA Average Residential Sale Price Index'],
//                         // housing_starts: +row['Housing starts'],
//                         mortgage_rates: +row['Interest rate on fixed 5-year mortgages [%]'],
//                         housing_market_value: +row['Market value of housing stock, LCU [C$; Millions]'],
//                     }})
//             } else {
//                 // For other datasets, keep them as they are
//                 return dataset;
//             }
//         });
//
//         // Call createVis with the renamed data
//         createVis(renamedData);
//         // createVis(data);
//     })
//     .catch(function (err) {
//         console.log(err)
//     });


// function createVis(data) {
//     let macro_data = data[0]
//     let consumer_data = data[1]
//     let housing_data = data[2]
//
//     console.log("macro_data: ", macro_data)
//     console.log("consumer_data: ", consumer_data)
//     console.log("housing_data: ", housing_data)
//
//     let macroChart = new LineChart("macro_vis", macro_data)
//     let consumerChart = new cBarChart("consumer_vis", consumer_data)
//     let housingChart = new hBarChart("housing_vis", housing_data)
//     let mortgageChart = new AreaChart("mortgage_vis", housing_data)
// }


// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out ALL the data', dataArray);

    let macro_data = dataArray[0]
    let consumer_data = dataArray[1]
    let housing_data = dataArray[2]
    let geoData = dataArray[3];
    let citiesData = dataArray[4];
    let industrialData = dataArray[5];
    let officeData = dataArray[6];
    let multifamilyData = dataArray[7];
    let retailData = dataArray[8];

    console.log("macro_data: ", macro_data)
    console.log("consumer_data: ", consumer_data)
    console.log("housing_data: ", housing_data)

    macroChart = new LineChart("macro_vis", macro_data)
    consumerChart = new cBarChart("consumer_vis", consumer_data)
    housingChart = new hBarChart("housing_vis", housing_data)
    mortgageChart = new AreaChart("mortgage_vis", housing_data)


    // Initialize map
    myMap = new CanadaMap('canada', geoData, citiesData, industrialData, multifamilyData, retailData);
    // myMap = new mapVis('canada', "data/canada.topo.json", "data/filtered_file.json", 'brushDiv');
    // Initialize map with actual data
    //myMap = new MapVis('canada', officeData, geoData, citiesData, industrialData, multifamilyData, retailData);

    console.log(officeData);

    // Initialize visualizations for each sector
    myIndustrial = new IndustrialVis('industrialVis', industrialData);
    myOffice = new CanadaMap('officeVis', officeData);
    myMultifamily = new MultifamilyVis('multifamilyVis', multifamilyData);
    myRetail = new RetailVis('retailVis', retailData);

    // init brush
    myBrushVis = new BrushVis('brushDiv', industrialData, officeData, multifamilyData, retailData);

    // Listen for the category selector change
    // document.getElementById('categorySelector').addEventListener('change', categoryChange);

    // Load each sector SVG
    loadSVG('industrial', 'img/industrial.svg');
    loadSVG('office', 'img/office.svg');
    loadSVG('multi', 'img/multi.svg');
    loadSVG('retail', 'img/retail.svg');


//     // Set the initial category
//     categoryChange();


// Category change function
// function categoryChange() {
//     selectedCategory = document.getElementById('categorySelector').value;
//
//     if (myMap) {
//         myMap.wrangleData();
//     } else {
//         console.error('myMap is not initialized');
//     }
//     if (myRetail) {
//         myRetail.wrangleData();
//     } else {
//         console.error('retail is not initialized');
//     }
//     // After initializing myBarVisOne and myBarVisTwo
//     if (myIndustrial) {
//         myIndustrial.wrangleData();
//     } else {
//         console.error('industrial is not initialized');
//     }
//
//     if (myMultifamily) {
//         myMultifamily.wrangleData();
//     } else {
//         console.error('multifamily is not initialized');
//     }
//
//     if (myOffice) {
//         myOffice.wrangleData();
//     } else {
//         console.error('office is not initialized');
//     }
// }

// Function to load and append SVG to the container
    function loadSVG(sectorId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(svgData => {
                document.getElementById(sectorId).innerHTML = svgData;
                // Add your hover event listener here
                document.getElementById(sectorId).addEventListener('mouseenter', () => {
                    // Update the map based on the sector hovered
                    updateMapForSector(sectorId);
                });
            });
    }

// Function to update the map visualization based on the sector
    function updateMapForSector(sectorId) {
        // Logic to update the map visualization
        console.log(`Update map for sector: ${sectorId}`);

        // Update the map based on the sector hovered
        myMap.wrangleData(sectorId);
        myBrushVis.wrangleData(sectorId);
        // myRetail.wrangleData(sectorId);
        // myIndustrial.wrangleData(sectorId);
        // myMultifamily.wrangleData(sectorId);
        // myOffice.wrangleData(sectorId);


    }


// Ensure the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Fetch and load the industrial SVG
        fetch('img/industrial.svg')
            .then(response => response.text())
            .then(data => {
                document.getElementById('industrial').innerHTML = data;
            });

        // Repeat the process for multi, office, and retail
        fetch('img/multi.svg')
            .then(response => response.text())
            .then(data => {
                document.getElementById('multi').innerHTML = data;
            });

        fetch('img/office.svg')
            .then(response => response.text())
            .then(data => {
                document.getElementById('office').innerHTML = data;
            });

        fetch('img/retail.svg')
            .then(response => response.text())
            .then(data => {
                document.getElementById('retail').innerHTML = data;
            });
    });

    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.scroll-section');
        const dots = document.querySelectorAll('.dot-navigation .dot');

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const pageScroll = document.documentElement.scrollTop;

            // Check if the section is currently active (in viewport)
            if (pageScroll >= sectionTop && pageScroll < sectionTop + sectionHeight) {
                dots[index].classList.add('active');
            } else {
                dots[index].classList.remove('active');
            }
        });
    });
// Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}