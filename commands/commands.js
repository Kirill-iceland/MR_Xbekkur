const Discord = require("discord.js");

const Drive = require('./../Drive.js')

const fetch = require('cross-fetch');

// const cvs = require('canvas')

const fs = require('fs');

const readline = require('readline');

const slash_com = require('./slash-com.js')

let bot;

let JamesBot;
let server_ip;
/**
 * 
 * @param {Discord.Client} bot_ 
 * @param {Drive.Project} Jamesbot_ 
 * @param {[]} EndingsList_ 
 */
function getVariables(bot_, Jamesbot_){
    bot = bot_
    JamesBot = Jamesbot_
}
exports.getVariables = getVariables

/**
 * 
 */
function command_reply(){
    slash_com.command_reply(bot, {server})
}
exports.command_reply = command_reply

function get_server_ip(){
    try{
        server_ip = JSON.parse(fs.readFileSync('./commands/mc_server_ip.json'))
    }catch(e){ 
        const rl_1 = readline.createInterface({ 
           input: process.stdin, 
           output: process.stdout, 
        }); 
        rl_1.question('Enter the server ip: ', (ip_) => { 
            rl_1.close(); 
            server_ip = ip_; 
            fs.writeFileSync('./commands/mc_server_ip.json', JSON.stringify(server_ip)); 
        })
    }
}
exports.get_server_ip = get_server_ip

/**
 * @param   {[
 *                   {name: 'online',   type: 1} |
 *                   {name: 'players',  type: 1} 
 *          ]} data
 * @param   {Discord.CommandInteraction} interaction 
 */
async function server(data, interaction){
    const server_data = await fetch("https://api.minetools.eu/ping/" + server_ip).then(result => result.json())
    if(!server_data.error){
        switch(data[0].name){
            case "online":
                return "Það er kveikt á servernum. " + server_data.players.online + "/" + server_data.players.max + " eru að spila á servernum"
            case "players":
                const more_server_data = await fetch("https://api.minetools.eu/query/" + server_ip).then(result => result.json())
                console.log(more_server_data)
                if(more_server_data.Players == 0){
                    return "Enginn er að spila"
                }else{
                    for(let i = 0; i < more_server_data.Players ; i++){
                        const player_info = await fetch(`https://api.mojang.com/users/profiles/minecraft/${options.options[0].value}`).then(result => result.json());
                        const embeded = new Discord.MessageEmbed()
                            .setAuthor(player_info.name,`https://crafatar.com/avatars/${player_info.id}?overlay`)
                            .setColor("#00FF00")
                        
                    }
                    return "Þeir sem eru að spila eru:"
                }
        }
    }else{
        return "Það er slökkt á servernum"
    }
}
