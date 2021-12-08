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
 * @param   {{options: [
 *                   {name: 'online',   type: 1} |
 *                   {name: 'players',  type: 1} 
 *          ]}} data 
 */
async function server(data){
    var server_data = await fetch("https://api.minetools.eu/ping/" + server_ip).then(result => result.json())
    if(!server_data.error){
        switch(data.options[0].name){
            case "online":
                return "Það er kveikt á servernum. " + server_data.players.online + "/" + server_data.players.max + " menn eru á servernum"
        }
    }else{
        return "Það er slökkt á servernum"
    }
}
