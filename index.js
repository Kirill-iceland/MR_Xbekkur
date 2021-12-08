const Discord = require("discord.js");


const {google} = require('googleapis');

const Drive = require('./Drive.js')

const readline = require('readline');   

const slash_com = require('./commands/slash-com.js')

const slash_com2 = require('./commands/commands.js')

var connect = require('connect');
var serveStatic = require('serve-static');

const _PORT = process.env.PORT || 3000;
connect()
    .use(serveStatic(__dirname + "/web"))
    .listen(_PORT, () => console.log('Server running on 3000...'));

const bot = new Discord.Client({ intents: [ Discord.Intents.FLAGS.GUILDS, 
                                            Discord.Intents.FLAGS.GUILD_INTEGRATIONS, 
                                            Discord.Intents.FLAGS.GUILD_MESSAGES]});

const fs = require('fs');

let token;

let drivebot;

var version = '1.0';

bot.on('ready', () => {
    // slash_com.send_commands_guild(bot, '701873712370286722', 'server');
    // slash_com.send_commands_all(bot, 'server');
    // slash_com.delete_commands_all(bot);
    // slash_com.delete_commands_guild(bot, '701873712370286722', 'server')
    slash_com2.command_reply()

    bot.user.setActivity("/server")

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
    slash_com2.get_server_ip()
});

drivebot = new Drive.Project("credentials.json", async drivebot => {
    try{
        slash_com2.getVariables(bot, drivebot)
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