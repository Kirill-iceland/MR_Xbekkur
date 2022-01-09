const Discord = require("discord.js");

const Drive = require('./../Drive.js')

const fetch = require('cross-fetch');

const cvs = require('canvas')

const Chart = require('chart.js')

const fs = require('fs');

const readline = require('readline');

const slash_com = require('./slash-com.js')

let bot;

let drivebot;

let server_ip;

const uno_id = '1ICwq5U0ub6xj_4tLruYuV39beeTxOGaLIfMQ68y6nx8';

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Águ', 'Sep', 'Ókt', 'Nóv', 'Des']

/**
 * 
 * @param {Discord.Client} bot_ 
 * @param {Drive.Project} drivebot_ 
 * @param {[]} EndingsList_ 
 */
function getVariables(bot_, drivebot_){
    bot = bot_
    drivebot = drivebot_
}
exports.getVariables = getVariables

/**
 * 
 */
function command_reply(){
    slash_com.command_reply(bot, {server, uno})
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
                if(server_data.players.online == 0){
                    return "Enginn er að spila"
                }else{
                    let embeds = [];
                    for(let i = 0; i < server_data.players.sample.length ; i++){
                        const embeded = new Discord.MessageEmbed()
                            .setAuthor(server_data.players.sample[i].name,`https://crafatar.com/avatars/${server_data.players.sample[i].id}?overlay`)
                            .setColor("#00FF00")
                        embeds.push(embeded)
                    }
                    while(embeds.length > 10){
                        interaction.channel.send({embeds: embeds.splice(0, 10)})
                    }
                    return {content: "Þeir sem eru að spila eru:", embeds: embeds}
                }
        }
    }else{
        return "Það er slökkt á servernum"
    }
}


async function getUnoYear(){
    const headder = await drivebot.getSpreadsheetHeader(uno_id)
    let res = []
    headder.sheets.forEach(v => res.push(v.properties.title))
    return res
}

async function getUnoData(years = []){
    let res = []
    for(let i = 0; i < years.length; i++){
        res.push(await drivebot.getSpreadsheet(uno_id, `'${years[i]}'`))
    }
    return res
}


/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 */
async function uno(interaction){
    /**
     * @param   {[
     *              {name: 'add',       type: 2, options: [
     *                  {name: 'player', type: 1, options: [
     *                      {name: 'name', type: 3, value: String}
     *                  ]} |
     *                  {name: 'win',    type: 1, options: [
     *                      {name: 'name', type: 3, value: String},
     *                      {name: 'date', type: 3, value: String}?
     *                  ]}
     *              ]} |
     *              {name: 'remove',    type: 2, options: [
     *                  {name: 'player', type: 1, options: [
     *                      {name: 'name', type: 3, value: String}
     *                  ]} |
     *                  {name: 'win',    type: 1, options: [
     *                      {name: 'name', type: 3, value: String},
     *                      {name: 'date', type: 3, value: String}?
     *                  ]}
     *              ]} |
     *              {name: 'change',    type: 2, options: [
     *                  {name: 'name',    type: 1, options: [
     *                      {name: 'name',     type: 3, value: String},
     *                      {name: 'new_name', type: 3, value: String}
     *                  ]}
     *              ]} |
     *              {name: 'score',    type: 2, options: [
     *                  {name: 'player',    type: 1, options: [
     *                      {name: 'name',    type: 3, value: String},
     *                      {name: 'options', type: 3, value: 'none' | 'graph' | 'table'}?
     *                  ]} |
     *                  {name: 'all',    type: 1}
     *              ]}
     *          ]} data
     */
    let data = interaction.options.data

    // console.log(uno_txt)
    const years = await getUnoYear()
    const uno_ = await getUnoData(years)
    // console.log(uno_)
    // console.log(JSON.stringify(data))
    
    switch(data[0].name){
        
        case 'add':
            if(data[0].options[0].name == 'player'){

            }else if(data[0].options[0].name == 'win'){

            }
            break;
        case 'remove':

            break;
        case 'change':

            break;
        case 'score':
            if(data[0].options[0].name == 'player'){
                const player = data[0].options[0].options[0].value
                
                const players = uno_[0].values[0]
                for(let i = 1; i < players.length; i++){
                    if(players[i] == player){

                        let res = '```\n' + player + ':'
                        let sum = 0;
                        let gdata = []
                        let glable = []
                        for(let y = 0; y < uno_.length; y++){
                            const year = uno_[y].values
                        
                            if(data[0].options[0].options[1] && data[0].options[0].options[1].value != 'none'){
                                if(data[0].options[0].options[1].value == 'graph'){
                                    
                                    let month = parseInt(year[2][0].split('.')[1]);
                                    let monthsum = 0

                                    if(y != 0){
                                        for(let m = 1; m < month; m++){
                                            gdata.push(0)
                                            glable.push(months[m] + ' ' + years[y])
                                        }
                                    }

                                    for(let j = 2; j < year.length - 1; j++){
                                        if(year[j][i] && year[j][i] != '' && year[j][i] != '0'){
                                            const current_month = parseInt(year[j][0].split('.')[1])
                                            if(current_month != month){
                                                gdata.push(monthsum)
                                                glable.push(months[month] + ' ' + years[y])
                                                for(let m = month + 1; m < current_month; m++){
                                                    gdata.push(0)
                                                    glable.push(months[m] + ' ' + years[y])
                                                }
                                                month = current_month
                                                monthsum = 0
                                            }
                                            monthsum += parseInt(year[j][i])
                                        }
                                    }
                                    
                                    gdata.push(monthsum)
                                    glable.push(months[month] + ' ' + years[y])
                                    if(y + 1 < uno_.length){
                                        for(let m = month + 1; m <= 12; m++){
                                            gdata.push(0)
                                            glable.push(months[m] + ' ' + years[y])
                                        }
                                    }
                                }else if(data[0].options[0].options[1].value == 'table'){
                                    
                                    res += '\n\n' + years[y] + ':'
                                    if(year[1][i] != '' && year[1][i] != '0'){
                                        const line = '\nN/A   - ' + year[1][i] + ' stig'
                                        res += line
                                    }
                                    for(let j = 2; j < year.length - 1; j++){
                                        if(year[j][i] && year[j][i] != '' && year[j][i] != '0'){
                                            const line = '\n' + year[j][0] + ' '.repeat(5 - year[j][0].length) + ' - ' + year[j][i] + ' stig'
                                            res += line
                                        }
                                    }
                                }
                            }
                            sum += parseInt(year[year.length - 1][i])
                        }
                        if(data[0].options[0].options[1] && data[0].options[0].options[1].value != 'none'){
                            if(data[0].options[0].options[1].value == 'graph'){
                                // console.log(glable)
                                // console.log(gdata)
                                const canvas = cvs.createCanvas(100 * gdata.length, 500)
                                const ctx = canvas.getContext('2d')

                                const data1 = {
                                    labels: glable,
                                    datasets: [{
                                        label: player,
                                        data: gdata,
                                        backgroundColor: [
                                          'rgba(255, 99, 132, 0.2)',
                                          'rgba(255, 129, 98, 0.2)',
                                          'rgba(255, 159, 64, 0.2)',
                                          'rgba(255, 182, 75, 0.2)',
                                          'rgba(255, 205, 86, 0.2)',
                                          'rgba(165, 199, 139, 0.2)',
                                          'rgba(75, 192, 192, 0.2)',
                                          'rgba(65, 177, 214, 0.2)',
                                          'rgba(54, 162, 235, 0.2)',
                                          'rgba(95, 132, 245, 0.2)',
                                          'rgba(153, 102, 255, 0.2)',
                                          'rgba(204, 101, 194, 0.2)'
                                        ],
                                        borderColor: [
                                          'rgb(255, 99, 132)',
                                          'rgb(255, 129, 98)',
                                          'rgb(255, 159, 64)',
                                          'rgb(255, 182, 75)',
                                          'rgb(255, 205, 86)',
                                          'rgb(165, 199, 139)',
                                          'rgb(75, 192, 192)',
                                          'rgb(65, 177, 214)',
                                          'rgb(54, 162, 235)',
                                          'rgb(95, 132, 245)',
                                          'rgb(153, 102, 255)',
                                          'rgb(204, 101, 194)'
                                        ],
                                        borderWidth: 1,
                                    }]
                                };
                                const config = {
                                    type: 'bar',
                                    data: data1,
                                    options: {
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    },
                                };

                                const graph = new Chart(ctx, config)
                                // fs.writeFileSync('test.png', canvas.toBuffer())
                                return {content: ' ', files: [{attachment: canvas.toBuffer(), name: player + '_graph.png'}]}
                            }else if(data[0].options[0].options[1].value == 'table'){
                                res += '\n' + '-'.repeat(14 + sum.length) + '\nsum:    ' + sum + ' stig\n```'
                                return res
                            }
                        }else{
                            return player + ' er með **' + sum + '** stig!'
                        }
                        
                    }
                }
                return player + ' fannst ekki'

            }else if(data[0].options[0].name == 'all'){

            }
    }
}
