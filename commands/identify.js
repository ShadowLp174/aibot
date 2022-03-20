const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs'); // File System | Node.js
const axios = require('axios'); // HTTP client
const FormData = require('form-data'); // Readable "multipart/form-data" streams

const languages = require("../data/languages.json");

const API_URL = 'https://my-api.plantnet.org/v2/identify/all?api-key=';
const API_PRIVATE_KEY = '2b10BZDOIOTg8ggsGa6weGyose'; // secret
const API_SIMSEARCH_OPTION = '&include-related-images=true'; // optional: get most similar images

function identify(interaction) {
  interaction.reply({ content: "This command is disabled! Just send .ai-help for proper usage." });
  return;
  /*return new Promise((res, rej) => {
    interaction.deferReply();

    var API_LANG = (interaction.options.length == 0) ? '&lang=en' : '&lang=' + interaction.options.get("language").value; // default: en
    if (!languages.includes(interaction.options.get("language").value)) API_LANG = '&lang=en';

    const IMAGE_1 = 'data/image_1.jpeg';
    const ORGAN_1 = 'flower';
    const IMAGE_2 = 'data/image_2.jpeg';
    const ORGAN_2 = 'leaf';

    (async () => {
    	let form = new FormData();

    	//form.append('organs', ORGAN_1);
    	form.append('images', fs.createReadStream(IMAGE_1));

    	/*form.append('organs', ORGAN_2);
    	form.append('images', fs.createReadStream(IMAGE_2));*/

    	/*try {
    		const { status, data } = await axios.post(
    			// list of probable species
    			API_URL + API_PRIVATE_KEY + API_LANG,
    			// list of probable species + most similar images
    			// API_URL + API_PRIVATE_KEY + API_SIMSEARCH_OPTION,
    			// list of probable species + french common names
    			// API_URL + API_PRIVATE_KEY + API_LANG,
    			form, {
    				headers: form.getHeaders()
    			}
    		);

    		console.log('status', status); // should be: 200
    		console.log('data', require('util').inspect(data, false, null, true));
    	} catch (error) {
    		console.error('error', error);
    	}
    })();
  });*/
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("identify")
    .setDescription("Identify the plant on an attached picture.")
    .addStringOption(option =>
      option.setName("language")
        .setDescription("The language, non-scientific names should be in. (en/de/...)")
        .setRequired(false)
        .setAutocomplete(true)),
  async execute(interaction) {
    await identify(interaction)
  }
}
