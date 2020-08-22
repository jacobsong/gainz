const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const createTables = require('./ddl');
const queries = require('./queries');
const scrape = require('./scrape');
const Discord = require("discord.js");
const config = require("./config/config");
const prefix = ".";
const discordId = '191635691594186753';

(async () => {


// SQLite
const db = await open({
  filename: './sqlite.db',
  driver: sqlite3.Database
});
await createTables(db);


// Initialize Discord and verify connected
const client = new Discord.Client({ disabledEvents: ["TYPING_START"] });
client.once("ready", () => {
  console.log("Connected as " + client.user.tag);
});


// Check stock every 30 seconds, send DM if stock changes
setInterval(async () => {
  await check();
}, 30000);


const check = async () => {
  const results = await scrape.getInventory('https://www.roguefitness.com/rogue-kg-change-plates');
  let isChanged = false;
    for (let i of results) {
      const row = await queries.getItem(db, i.itemId);
      if (row === undefined) {
        await queries.insertItem(db, i.itemId, i.inStock);
      } else {
        if (i.inStock != row.inStock) {
          isChanged = true;
          await queries.updateItem(db, i.itemId, i.inStock);
        }
      }
    }
    if (isChanged) {
      (await client.users.fetch(discordId)).send(createEmbed(results));
    }
};


// Respond to commands
client.on("message", async message => {
  if (!message.content.startsWith("check") || message.author.bot) return;
  const args = message.content.split(' ');
  const commandName = args.shift().toLowerCase();
  if (commandName == "check") {
    const results = await scrape.getInventory('https://www.roguefitness.com/rogue-kg-change-plates');
    message.reply(createEmbed(results));
  }
});


// Create embed
const createEmbed = (results) => {
  const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle("Stock Check")
    .setTimestamp();
  let desc = "```";
  results.forEach((i) => {
    let statusDesc = parseInt(i.inStock) > 0 ? "✅" : "❌";
    desc += `${statusDesc} ${i.name}\n`;
  });
  desc += "```";
  embed.setDescription(desc);
  return embed;
};


// Log in with bot token
try {
  client.login(config.token);
} catch (e) {
  console.log("Failed to login to Discord");
}


})();