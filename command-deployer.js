const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const configFile = (process.argv[2]) ? process.argv[2] : './config.json';
const { token, clientId, guildIds } = require(configFile);
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log("currently disabled");
		/*console.log('Started refreshing application (/) commands.');

		for (let i = 0; i < guildIds.length; i++) {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildIds[i]),
				{ body: commands },
			);
		}

		console.log('Successfully reloaded application (/) commands.');*/
	} catch (error) {
		console.error(error);
	}
})();
