const Discord = require('discord.js');
const fs = require('fs')
const json = JSON.parse(fs.readFileSync('commands/commands.json'))



/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 * @param {String} command_name
 */
function send_commands_guild(client, guild_id, command_name = 'all'){
    json.forEach(command_ => {
        if(command_name == command_.name || command_name == 'all'){
            client.api.applications(client.user.id).guilds(guild_id).commands.post({data: command_})
        }
    });
}
exports.send_commands_guild = send_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 * @param {String} command_name
 */
function send_commands_all(client, command_name = 'all'){
    json.forEach(command_ => {
        if(command_name == command_.name || command_name == 'all'){
            client.api.applications(client.user.id).commands.post({data: command_})
        }
    });
}
exports.send_commands_all = send_commands_all;


/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 */
async function delete_commands_guild(client, guild_id){
    const commands_ = await client.api.applications(client.user.id).guilds(guild_id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).guilds(guild_id).commands(command_.id).delete()
    });
}
exports.delete_commands_guild = delete_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 */
async function delete_commands_all(client){
    const commands_ = await client.api.applications(client.user.id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).commands(command_.id).delete()
    });
}
exports.delete_commands_all = delete_commands_all;

/**
 * 
 * @param {Discord.Client} client 
 * @param {{
 *          server:     (data: {}, interactin: Discord.CommandInteraction) => Promise<String> 
 *        }} commands
 */
function command_reply(client, commands){
    
    client.on("interactionCreate", async interaction => {
        if(interaction.isCommand()){
            if(interaction.commandName == "server"){
                interaction.deferReply()
                interaction.editReply(await commands.server(interaction.options.data, interaction))
            }
        }
    })
}
exports.command_reply = command_reply;