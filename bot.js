const commandHandler = require("./commandHandler");
const covid = require("./covid");
const discord = require("./imports").client;

discord.on('ready', () => {
    covid.downloadData();
    commandHandler.register();
});