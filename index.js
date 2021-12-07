const Discord = require("discord.js");


const {google} = require('googleapis');

const Drive = require('./Drive.js')

const readline = require('readline');   

const slash_com = require('./commands/slash-com.js')

const slash_com2 = require('./commands/commands.js')

const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs');

let token;

let drivebot;

var version = '1.0';

bot.on('ready', () => {
    // slash_com.send_commands_guild(bot, '701873712370286722', 'advice');
    // slash_com.send_commands_all(bot, 'history');
    // slash_com.delete_commands_all(bot);
    // slash_com.delete_commands_guild(bot, '701873712370286722', 'advice')
    // slash_com2.command_reply()

    bot.user.setActivity("/help")

    if(Drive.WaitingForInput){
        Drive.WaitingForInputCallback(() => {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            console.log("Bot login".green + " - " + (`Finished, version ` + version).green);
        })
    }else{
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log("Bot login".green + " - " + (`Finished, version ` + version).green);
    }
});

drivebot = new Drive.Project("credentials.json", async drivebot => {
    try{
        token = JSON.parse(fs.readFileSync("bot_Token.json"));
        bot.login(token);
        process.stdout.write("Bot login".green + " - " + `[..........] 0%`.red);
    }catch(e){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the bot token: ', (Token_) => {
            rl.close();
            token = Token_;
            fs.writeFileSync('bot_Token.json', JSON.stringify(token));
            bot.login(token);
            process.stdout.write("Bot login".green + " - " + `[..........] 0%`.red);
        });
    }
})