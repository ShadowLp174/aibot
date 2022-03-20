const fs = require('fs');
const https = require('https');
const { Client, Collection, Intents } = require('discord.js');
const configFile = (process.argv[2]) ? process.argv[2] : './config.json';
const { token, plantnet } = require(configFile);
const PlantIdentifier = require('./identifier.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const identifier = new PlantIdentifier(plantnet);

const languages = require("./data/languages");

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity("by RedTech", {
		type: "PLAYING"
	});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate", async message => {
  if (message.author.bot || message.author.id == client.user.id) return;
  const args = message.content.toLowerCase().trim().split(" ");
  if (args[0] == ".identify") {
    var lang = '&lang=en';
    if (args[1]) {
      lang = '&lang=' + args[1];
      if (!languages.includes(args[1])) lang = '&lang=en';
    }
    var image;
    message.attachments.forEach((attachment, i) => {
      if (!attachment.contentType.includes("image")) return
      image = attachment.url;
    });
		if (!image) {message.reply("Please attach an image to identify"); return;}
		https.get(image, async (stream) => {
			const plant = await identifier.identify(stream, lang);
			if (plant.status != 200) {message.reply("An error occured or the plant could not be identified."); return;}
			const result = plant.data.results[0];
			message.reply({ embeds: [identifier.createEmbed(result)] });
		});
  }
});

client.login(token);
