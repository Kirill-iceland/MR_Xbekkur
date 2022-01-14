const Discord = require("discord.js");

const Drive = require('./../Drive.js')

const fetch = require('cross-fetch');

const cvs = require('canvas')

const Chart = require('chart.js')

const fs = require('fs');

const readline = require('readline');

const slash_com = require('./slash-com.js');
const { options } = require("nodemon/lib/config");
const nodemon = require("nodemon");

let bot;

let drivebot;

let server_ip;

const uno_id = '1ICwq5U0ub6xj_4tLruYuV39beeTxOGaLIfMQ68y6nx8';

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Águ', 'Sep', 'Ókt', 'Nóv', 'Des']

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


/**
 * 
 * @param {number} index 
 * @returns {String}
 */
function excel_Letter(index){
    if(index >= 0){
        return excel_Letter(Math.floor(index/ 26) - 1) + alphabet[index % 26]
    }
    return ""
}

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
    let id = []
    headder.sheets.forEach(v => {res.push(v.properties.title); id.push(v.properties.sheetId)})
    return [res, id]
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
 * @param {String} player 
 * @param {String} year 
 * @param {String[]} years 
 */
function addUnoSheet(player, year, years){
    let index = undefined
    for(let y = 0; y < years.length; y++){
        if(parseInt(year) < parseInt(years[y])){
            index = y
            y = years.length
        }
    }
    drivebot.addSheetSpreadsheet(uno_id, year, {index: index, gridProperties: {frozenRowCount: 1, frozenColumnCount: 1}})
}

const uno_space = 5;
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
    const getYears = await getUnoYear()
    const years = getYears[0]
    const years_id = getYears[1]
    const uno_ = await getUnoData(years)
    // console.log(uno_)
    // console.log(JSON.stringify(data))
    
    switch(data[0].name){
        
        case 'add':
            if(data[0].options[0].name == 'player'){
                return 'N/A'
            }else if(data[0].options[0].name == 'win'){
                const players = uno_[0].values[0]
                const player = data[0].options[0].options[0].value
                let date;
                let str_date

                if(data[0].options[0].options[1]){
                    if(data[0].options[0].options[1].value == 'unknown'){
                        date = {getFullYear: () => (new Date()).getFullYear(), oskilgeint: true}
                    }else{
                        date = new Date(data[0].options[0].options[1].value)
                        str_date = date.getDate() + '.' + (date.getMonth() + 1)
                    }
                }else{
                    date = new Date()
                    str_date = date.getDate() + '.' + (date.getMonth() + 1)
                }

                for(let i = 1; i < players.length; i++){
                    if(players[i] == player){
                        for(let y = 0; y < uno_.length; y++){

                            const year_ = years[y]
                            const year = uno_[y].values
                            if(parseInt(year_) == date.getFullYear()){

                                if(!date.oskilgeint){
                                    for(let j = 2; j < year.length - 1; j++){
                                        if(!year[j][0] || year[j][0] == ''){
                                            //tested
                                            if(year.length - j > uno_space + 1){
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i) + (j + 1).toString()}`, "USER_ENTERED", [[1]])
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!A${(j + 1).toString()}`, "USER_ENTERED", [[str_date + '.' + year_]])
                                            }else{
                                                await drivebot.insertRangeSpreadsheet(uno_id, {sheetId: years_id[y], startRowIndex: j, endRowIndex: 2 * j + uno_space + 2 - year.length , startColumnIndex: 0, endColumnIndex: players.length}, "ROWS")
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i) + (j + 1).toString()}`, "USER_ENTERED", [[1]])
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!A${(j + 1).toString()}`, "USER_ENTERED", [[str_date + '.' + year_]])
                                            }
                                            return 'Vinningi var bætt hjá **' + player + '** þann `' + str_date + `'` + date.getFullYear() + '`!'
                                        }

                                        const current_date = year[j][0].split('.')
                                        if(year[j][0] == str_date){
                                            //tested
                                            if(isNaN(parseInt(year[j][i]))){
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i) + (j + 1).toString()}`, "USER_ENTERED", [[1]])
                                            }else{
                                                await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i) + (j + 1).toString()}`, "USER_ENTERED", [[1 + parseInt(year[j][i])]])
                                            }
                                            return 'Vinningi var bætt hjá **' + player + '** þann `' + str_date + `'` + date.getFullYear() + '`!'
                                        }else if((parseInt(current_date[0]) > date.getDate() && parseInt(current_date[1]) == date.getMonth() + 1) || (parseInt(current_date[1]) > date.getMonth() + 1)){
                                            //tested
                                            await drivebot.insertRangeSpreadsheet(uno_id, {sheetId: years_id[y], startRowIndex: j, endRowIndex: j + 1, startColumnIndex: 0, endColumnIndex: players.length}, "ROWS")
                                            await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i) + (j + 1).toString()}`, "USER_ENTERED", [[1]])
                                            await drivebot.updateSpreadsheet(uno_id, `'${year_}'!A${(j + 1).toString()}`, "USER_ENTERED", [[str_date + '.' + year_]])
                                            return 'Vinningi var bætt hjá **' + player + '** þann `' + str_date + `'` + date.getFullYear() + '`!'
                                        }
                                    }
                                    return 'Vinningi var bætt hjá **' + player + '** þann `' + str_date + `'` + date.getFullYear() + '`!'
                                }

                                if(isNaN(parseInt(year[1][i]))){
                                    await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i)}2`, "USER_ENTERED", [['1']])
                                }else{
                                    await drivebot.updateSpreadsheet(uno_id, `'${year_}'!${excel_Letter(i)}2`, "USER_ENTERED", [[1 + parseInt(year[1][i])]])
                                }
                                return 'Vinningi var bætt hjá **' + player + '** á ókunugum deigi!'
                            }


                        }
                        addUnoSheet(players, date.getFullYear().toString(), years)
                        if(!date.oskilgeint){
                            return 'Vinningi var bætt hjá **' + player + '** þann `' + str_date + `'` + date.getFullYear() + '`!'
                        }
                        return 'Vinningi var bætt hjá **' + player + '** á ókunugum deigi!'
                    }
                }
                return player + ' fannst ekki'
            }
            break;
        case 'remove':
            return 'N/A'



        case 'change':
            const player = data[0].options[0].options[0].value
            const name = data[0].options[0].options[1].value
            const players = uno_[0].values[0]

            for(let i = 1; i < players.length; i++){
                if(players[i] == player){
                    for(let y = 0; y < uno_.length; y++){
                        const year = years[y]
                        await drivebot.updateSpreadsheet(uno_id, `'${year}'!${excel_Letter(i)}1`, "USER_ENTERED", [[name]])
                    }
                    return 'Nafninu **' + player + '** var breitt í **' + name + '**!'
                }
            }
            return player + ' fannst ekki'



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
                                    if(year[1][i] && year[1][i] != '' && year[1][i] != '0'){
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
                                const embededMSG = new Discord.MessageEmbed()
                                    .setColor('#cc5555')
                                    .setTitle(player)
                                    .setFooter(interaction.user.username, interaction.user.avatarURL())
                                    .setImage('attachment://' + player + '_graph.png');
                                return {content: ' ', embeds: [embededMSG], files: [{attachment: canvas.toBuffer(), name: player + '_graph.png'}]}
                            }else if(data[0].options[0].options[1].value == 'table'){
                                res += '\n' + '-'.repeat(14 + sum.toString().length) + '\nsum:    ' + sum + ' stig\n```'
                                return res
                            }
                        }else{
                            return player + ' er með **' + sum + '** stig!'
                        }
                        
                    }
                }
                return player + ' fannst ekki'

            }else if(data[0].options[0].name == 'all'){
                const players = uno_[0].values[0]
                const player_data = []
                let max_length = 0

                for(let i = 1; i < players.length; i++){
                    const player = players[i]
                    let sum = 0
                    max_length = Math.max(player.length, max_length)

                    for(let y = 0; y < uno_.length; y++){
                        const year = uno_[y].values
                        sum += parseInt(year[year.length - 1][i])
                    }

                    player_data.push({player, value: sum})
                }
                player_data.sort((a, b) => b.value - a.value)

                let res = '```\n'

                let rank_value = -1
                player_data.forEach((p, i) => {
                    if(rank_value == p.value){
                        res += '    ' + p.player + ' '.repeat(max_length - p.player.length) + ' - ' + p.value + ' stig\n'
                    }else{
                        let rank = (i + 1).toString()
                        res += rank + '.' + ' '.repeat(3 - rank.length) + p.player + ' '.repeat(max_length - p.player.length) + ' - ' + p.value + ' stig\n'
                    }
                    rank_value = p.value
                })
                return res + '```'
            }
    }
}
