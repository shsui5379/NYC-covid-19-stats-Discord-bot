const Discord = require("discord.js");

/**
 * @type {Discord.ApplicationCommandData} JSON of data to load for slash commands
 */
exports.DATA = [
    {
        name: "covid",
        description: "NYC covid-19 stats from DOMHM",
        type: "SUB_COMMAND_GROUP",
        options: [
            {
                name: "summary",
                description: "Citywide stats",
                type: "SUB_COMMAND"
            },
            {
                name: "zip",
                description: "Stats at zip",
                type: "SUB_COMMAND",
                options: [{
                    name: "zip",
                    description: "The zip to find data for",
                    type: "INTEGER",
                    required: true
                }]
            },
            {
                name: "boro",
                description: "Stats at borough",
                type: "SUB_COMMAND",
                options: [{
                    name: "boro",
                    description: "The boro to find data for",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "Brooklyn",
                            value: "brooklyn",
                        },
                        {
                            name: "Queens",
                            value: "queens"
                        },
                        {
                            name: "Manhattan",
                            value: "manhattan"
                        },
                        {
                            name: "Bronx",
                            value: "bronx"
                        },
                        {
                            name: "Staten Island",
                            value: "staten"
                        }
                    ]
                }]
            },
            {
                name: "date",
                description: "Stats at date",
                type: "SUB_COMMAND",
                options: [{
                    name: "date",
                    description: "The date to find data for, format: MM/DD/YYYY, last 90 days only",
                    type: "STRING",
                    required: true
                }]
            },
            {
                name: "refresh",
                description: "Refresh the data files",
                type: "SUB_COMMAND"
            }
        ]
    }
];