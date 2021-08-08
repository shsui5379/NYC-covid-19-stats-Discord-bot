# NYC-covid-19-stats-Discord-bot
Discord.js bot for NYC covid-19 stats, using NYC DOHMH's data dumps

This uses slash commands, so must be invited with the `applications.command` scope

/covid summary:
- daily average cases, hospitalizations, deaths
- 7 day positivity rate
- percentage of cases of the Delta varient
- percentage of vaccinated people

/covid zip <zip>:
- cases this week
- percentage of people with antibodies
- 7 day positivity rate
- percentage of vaccinated people

/covid boro <boro>:
- cumulative cases, hospitalizations, deaths
- percentage of people with antibodies
- percentage of vaccinated people

/covid date <MM/DD/YYYY>:
- new cases, hospitalizations, deaths that day per borough
- 7 day positivity rate on that day per borough

/covid refresh
- Downloads the latest data
- Note: Data updates are typically uploaded daily at 1PM EST

Sources:
https://github.com/nychealth/coronavirus-data
https://github.com/nychealth/covid-vaccine-data

Data is subject to the 3 day lag in the city's reporting systems