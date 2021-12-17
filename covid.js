const https = require("https");
const csv = require("csv-parser");

const urls = {
    borough: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/totals/by-boro.csv",
    date: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/latest/now-data-by-day.csv",
    summary: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/latest/now-summary.csv",
    zip: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/latest/last7days-by-modzcta.csv",
    zipAntibody: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/totals/antibody-by-modzcta.csv",
    boroAntibody: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/totals/antibody-by-boro.csv",
    zipPp: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/latest/pp-by-modzcta.csv",
    varient: "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/variants/variant-epi-data.csv",
    zipVax: "https://raw.githubusercontent.com/nychealth/covid-vaccine-data/main/people/coverage-by-modzcta-allages.csv",
    boroVax: "https://raw.githubusercontent.com/nychealth/covid-vaccine-data/main/people/coverage-by-boro-demo-fully.csv"
};

let data = {
    borough: [],
    date: [],
    summary: [],
    zip: [],
    zipAntibody: [],
    boroAntibody: [],
    zipPp: [],
    varient: [],
    zipVax: [],
    boroVax: []
};

/**
 * Download the latest data files
 */
exports.downloadData = function () {
    data = {
        borough: [],
        date: [],
        summary: [],
        zip: [],
        zipAntibody: [],
        boroAntibody: [],
        zipPp: [],
        varient: [],
        zipVax: [],
        boroVax: []
    };

    for (const type in urls) {
        https.get(urls[type], function (response) {
            response.pipe(csv()).on('data', (row) => {
                data[type].push(row);
            });
        });
    }
}

/**
 * Citywide stats
 * @returns {String} summary
 */
exports.getSummary = function () {
    var toSend = "";

    toSend += "NYC summary: \n \n";
    toSend += "Cases daily average: " + data.summary[1].DAILY_AVG_7DAY + "\n";
    toSend += "Hospitalizations daily average: " + data.summary[4].DAILY_AVG_7DAY + "\n";
    toSend += "Deaths daily average: " + data.summary[5].DAILY_AVG_7DAY + "\n";
    toSend += "7 days rolling positivity rate: " + data.summary[0].LAST_7_DAY + "%\n\n";

    toSend += "Percentage of cases this week that is of the Omicron varient: " + data.varient[data.varient.length - 1]["B.1.1.529 percent"] + "%\n";
    toSend += "Citywide percentage of fully vaccinated people: " + data.boroVax[0].CITY_PERC_FULLY + "%\n\n"

    toSend += "Source: " + "https://github.com/nychealth/coronavirus-data \n";
    toSend += data.summary[6].MEASURE + "\n";

    return toSend;
}

/**
 * Data by zip
 * @param {Number} zipNum zip code
 * @returns {String} data report
 */
exports.getZipData = function (zipNum) {
    var toSend = "";
    var idx = undefined;
    var idx2 = undefined;
    var idx3 = undefined;

    if ((zipNum + "").length == 5) { //cov zip
        for (var i of data.zip) { //locate
            if (i.modzcta == zipNum) {
                idx = i;
            }
        }
        for (var i of data.zipAntibody) { //locate
            if (i.modzcta_first == zipNum) {
                idx2 = i;
            }
        }
        for (var i of data.zipVax) {
            if (i.MODZCTA == zipNum) {
                idx3 = i;
            }
        }
        if (idx == undefined) {
            return "That zip code does not exist.";
        } else { //synthesize
            toSend += idx.people_positive + " cases this week. \n";
            toSend += idx2.PERCENT_POSITIVE + "% tested with antibodies\n";
            toSend += "7 days rolling positivity rate: " + idx.percentpositivity_7day + "%\n";
            toSend += "Percentage of fully vaccinated people: " + idx3.PERC_FULLY + "%";
            return toSend;
        }
    }
    return "Invalid";
}

/**
 * Data by borough
 * @param {String} boroName name of the borough for data
 * @returns data report
 */
exports.getBoroData = function (boroName) {
    var toSend = "";
    var idx = undefined;
    var idx2 = undefined;

    for (var i in data.borough) { //locate
        if (boroName.toLowerCase() == data.borough[i][Object.keys(data.borough[i])[0]].toLowerCase()) {
            idx = i;
        }
    }
    if (boroName.toLowerCase() == "staten") { //special cases
        idx = 4;
    } else if (boroName.toLowerCase() == "bronx") {
        idx = 0;
    }

    if (boroName.toUpperCase() == "staten") { //special cases
        idx2 = 4;
    } else if (boroName.toUpperCase() == "queens") {
        idx2 = 0;
    }

    //vaccination
    var vaxxPercentage;
    switch (boroName) {
        case "queens":
            vaxxPercentage = data.boroVax[0].QS_PERC_FULLY;
            break;
        case "brooklyn":
            vaxxPercentage = data.boroVax[0].BK_PERC_FULLY;
            break;
        case "bronx":
            vaxxPercentage = data.boroVax[0].BX_PERC_FULLY;
            break;
        case "manhattan":
            vaxxPercentage = data.boroVax[0].MH_PERC_FULLY;
            break;
        case "staten":
            vaxxPercentage = data.boroVax[0].SI_PERC_FULLY;
            break;
    }

    if (idx == undefined) {
        return "That boro does not exist";
    } else { //synthesize
        toSend += data.borough[idx].CASE_COUNT + " cumulative cases. \n";
        toSend += data.borough[idx].HOSPITALIZED_COUNT + " cumulative hospitalizations. \n";
        toSend += data.borough[idx].DEATH_COUNT + " cumulative confirmed deaths. \n";
        toSend += data.borough[idx2].PROBABLE_DEATH + " cumulative probable deaths. \n\n";
        toSend += parseFloat(data.boroAntibody[idx].PERCENT_POSITIVE * 100).toFixed(2) + "% tested with antibodies\n";
        toSend += vaxxPercentage + "% of people fully vaccinated";
        return toSend;
    }
}

/**
 * Data by date
 * @param {String} dateStr Date to find data for, as string formatted in MM/DD/YYYY
 * @returns {String} data report
 */
exports.getDateData = function (dateStr) {
    var toSend = "";
    var idx = undefined;
    var idx2 = undefined;

    for (var i in data.date) { //locate
        if (dateStr == data.date[i][Object.keys(data.date[i])[0]]) {
            idx = i;
        }
    }
    for (var i of data.zipPp) { //locate
        if (i["End date"] == dateStr) {
            idx2 = i;
        }
    }
    if (idx == undefined) {
        return "Data for that date does not exist";
    } else { //synthesize
        toSend += "Brooklyn: " + data.date[idx].BK_CASE_COUNT + " new cases, " + data.date[idx].BK_HOSPITALIZED_COUNT + " new hospitalizations, " + data.date[idx].BK_DEATH_COUNT + " new deaths. 7 days positive rate: " + idx2.Brooklyn + "%\n";
        toSend += "Bronx: " + data.date[idx].BX_CASE_COUNT + " new cases, " + data.date[idx].BX_HOSPITALIZED_COUNT + " new hospitalizations, " + data.date[idx].BX_DEATH_COUNT + " new deaths. 7 days positive rate: " + idx2.Bronx + "%\n";
        toSend += "Manhattan: " + data.date[idx].MN_CASE_COUNT + " new cases, " + data.date[idx].MN_HOSPITALIZED_COUNT + " new hospitalizations, " + data.date[idx].MN_DEATH_COUNT + " new deaths. 7 days positive rate: " + idx2.Manhattan + "%\n";
        toSend += "Queens: " + data.date[idx].QN_CASE_COUNT + " new cases, " + data.date[idx].QN_HOSPITALIZED_COUNT + " new hospitalizations, " + data.date[idx].QN_DEATH_COUNT + " new deaths. 7 days positive rate: " + idx2.Queens + "%\n";
        toSend += "Staten Island: " + data.date[idx].SI_CASE_COUNT + " new cases, " + data.date[idx].SI_HOSPITALIZED_COUNT + " new hospitalizations, " + data.date[idx].SI_DEATH_COUNT + " new deaths. 7 days positive rate: " + idx2["Staten Island"] + "%\n";
        return toSend;
    }
}
