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

    if (!msg.substring(0, 1).localeCompare(config.prefix))
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

    if (switchcase(config.media, cmd))
        playAudio(message, cmd);
    if (!cmd.localeCompare('help'))
        help(message);
}

const playAudio = async (message, file) => {
    const vchannel = message.member.voiceChannel;
    const vchannelName = !vchannel ? null : vchannel.name;
    const botName = bot.user.username;
    let dispatcher;

    if (!vchannel)
        return await message.reply(`you gotta be in a voice channel, yo.`)

    await vchannel.join()
        .then(connection => {
            dispatcher = connection.playFile(config.media[file]);
            logger.logInfo('[***%s has started playing %s in %s***]', [botName, config.media[file], vchannelName]);

            dispatcher.on("end", end => {
                vchannel.leave();
                logger.logInfo('[***%s has left %s***]', [botName, vchannelName]);
            });
        })
        .catch(error => logger.logError('Whoops! Couldn\'t play %s.:\n', [error]));
}


const help = async (message) => await message.channel.send(config.helpMenu.join(''));
const switchcase = (cases, key) => cases.hasOwnProperty(key) ? true : false;