const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const logger = require("./logger");

bot.on('ready', () => {  
    logger.logInfo('[***%s has started***]\n%s users \n%s channels \n%s guild(s)', [bot.user.username, bot.users.size, bot.channels.size, bot.guilds.size]);
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('message', async message => {
    var msg = message.content;

    if (msg.substring(0, 1) == '!')
        await processMemberCommand(message).catch(error => logger.logError('Whoops! %s', [error]));
    if (config.filter.includes(msg.toLowerCase()))
        await kickThisBitch(message);
});

const kickThisBitch = async (msg) => {
    var reason = `Saying some silly shit like this: "${msg.content}".`
    await msg.member
        .kick(reason)
        .then(() => msg.reply(`${msg.member.user.tag} has been kicked by ${msg.author.tag} because: ${reason}`))
        .catch(error => msg.reply(`I couldn't kick because of : ${error}`));
}

const processMemberCommand = async (message) => {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
        case 'ping':
            message.channel.send(`Hey, ${message.member.displayName}. You done did a ping.`);
        break;
     }
}

bot.login(config.token).catch(error => logger.logError('Whoops! %s', [error]))