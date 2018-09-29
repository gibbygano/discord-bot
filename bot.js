const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const logger = require("./logger");

bot.on('ready', () => {  
    logger.logInfo('[***%s has started***]\n%s users \n%s channels \n%s guild(s)', [bot.user.username, bot.users.size, bot.channels.size, bot.guilds.size]);
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on('message', async message => {
    const msg = message.content;

    if (msg.substring(0, 1) == '!')
        await processMemberCommand(message).catch(error => logger.logError('Whoops! %s', [error]));
    if (config.filter.includes(msg.toLowerCase()))
        await kickThisBitch(message);
});
bot.login(config.token).catch(error => logger.logError('Whoops! Had a problem logging in.:\n%s', [error]))


const kickThisBitch = async (msg) => {
    let reason = `Saying some silly shit like this: "${msg.content}".`
    await msg.member
        .kick(reason)
        .then(() => msg.reply(`${msg.member.user.tag} has been kicked by ${msg.author.tag} because: ${reason}`))
        .catch(error => msg.reply(`I couldn't kick because of : ${error}`));
}

const processMemberCommand = async (message) => {
    let args = message.content.substring(1).split(' ');
    const cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
        case 'ping':
            return await message.channel.send(`Hey, ${message.member.displayName}. You done did a ping.`);
        case 'rock':
            return await playAudio(message, cmd);
        case 'africa':
            return playAudio(message, cmd);
        case 'help':
            return help(message);
     }
}

const playAudio = async (message, file) => {
    const vchannel = message.member.voiceChannel;
    const vchannelName = vchannel.name;
    const botName = bot.user.username;
    let dispatcher;

    if (!vchannel)
        return await message.reply(`you gotta be in a voice channel, yo.`)

    await vchannel.join()
        .then(connection => {
            switch(file) {
                case 'rock':
                    dispatcher = connection.playFile(config.media.rock1);
                    return logger.logInfo('[***%s has started playing %s in %s***]', [botName, config.media.rock1, vchannelName]);
                case 'africa':
                    dispatcher = connection.playFile(config.media.africa);
                    return logger.logInfo('[***%s has started playing %s in %s***]', [botName, config.media.africa, vchannelName]);
            }
            dispatcher.on("end", end => {
                vchannel.leave(); 
                logger.logInfo('[***%s has left %s***]', [botName, vchannelName]);
            });
        })
        .catch(error => logger.logError('Whoops! Couldn\'t play %s.:\n', [error]));
}

const help = async (message) => {
    await message.channel.send(config.helpMenu.join(''));
}