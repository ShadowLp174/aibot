const axios = require('axios'); // HTTP client
const FormData = require('form-data');
const { MessageEmbed } = require("discord.js");

class PlantIdentifier {
  constructor(key) {
    this.API_URL = 'https://my-api.plantnet.org/v2/identify/all?api-key=';
    this.API_PRIVATE_KEY = key;

    return this;
  }

  identify(image, lang) {
    return new Promise(async (res, rej) => {
      let form = new FormData();

    	form.append('images', image);

    	try {
    		const { status, data } = await axios.post(
    			this.API_URL + this.API_PRIVATE_KEY + lang,
    			form, {
    				headers: form.getHeaders()
    			}
    		);

        res({status: status, data: data});
    	} catch (error) {
    		rej(error);
    	}
    });
  }

  print(data) {
    let species = data.species;
    let msg = "**" + species.scientificName + "**\n";
    msg += "Also known as: " + species.commonNames.join(", ") + "\n\n";
    msg += "Genus: " + species.genus.scientificName + "\n";
    msg += "Family: " + species.family.scientificName + "\n";
    msg += "\nMatch: " + data.score * 100 + "%";
    return msg;
  }
  createEmbed(data) {
    let species = data.species;
    let id = (data.gbif) ? data.gbif.id : "";
    return new MessageEmbed()
      .setColor("#349D43")
      .setTitle(species.scientificName)
      .setURL("https://www.gbif.org/species/" + id)
      .setDescription("Aka: " + species.commonNames.join(", "))
      .addFields(
        { name: "Genus", value: species.genus.scientificName, inline: true },
        { name: "Family", value: species.family.scientificName, inline: true })
      .setTimestamp()
      .setFooter({ text: "This result is not perfect. It's accuracy is " + (data.score * 100) + "%"})
  }
}

module.exports = PlantIdentifier;
