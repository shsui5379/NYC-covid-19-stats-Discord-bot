const covid = require("./covid");
const discord = require("./imports").client;

/**
 * Registers our slash commands to the Interactions API
 * Also register our event handler
 */
exports.register = function () {
    discord.application.commands.set(require("./commandData"));

    discord.on("interactionCreate", function (interaction) {
        if (interaction.isCommand()) {
            if (interaction.commandName == "covid") {
                let sub = interaction.options.data[0];
                if (sub.name == "summary") {
                    interaction.reply(covid.getSummary());
                } else if (sub.name == "zip") {
                    interaction.reply(covid.getZipData(sub.options[0].value));
                } else if (sub.name == "boro") {
                    interaction.reply(covid.getBoroData(sub.options[0].value));
                } else if (sub.name == "date") {
                    interaction.reply(covid.getDateData(sub.options[0].value));
                } else if (sub.name == "refresh") {
                    covid.downloadData();
                    interaction.reply("Downloading...");
                }
            }
        }
    });
}