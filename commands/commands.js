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
try{
    server_ip = JSON.parse(fs.readFileSync('./commands/mc_server_ip.json'))
}catch(e){ 
    const rl = readline.createInterface({ 
       input: process.stdin, 
       output: process.stdout, 
    }); 
    rl.question('Enter the server ip: ', (ip_) => { 
        rl.close(); 
        server_ip = ip_; 
        fs.writeFileSync('./commands/mc_server_ip.json', JSON.stringify(server_ip)); 
    })
}
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

/**
 * @param   {{options: [
 *                   {name: 'online',   type: 1} |
 *                   {name: 'players',  type: 1} 
 *          ]}} data 
 */
function server(data){
    var server_data = fetch("https://api.mcsrvstat.us/2/" + server_ip)
    if(server_data.online){
        switch(data.options[1].name){
            case "online":
                return "Það er kveikt á servernum." + server_data.players.online + "/" + server_data.players.max + " menn eru á servernum"
        }
    }else{
        return "Það er slökkt á servernum"
    }
}
