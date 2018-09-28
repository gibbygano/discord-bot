const winston = require('winston')

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: `bootbot_log_${Date.now()}.log` })
    ],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.splat(),
        winston.format.simple()
    )
});

module.exports = {
    logInfo: (info, args) => { 
        logger.log('info', info, ...args);
    },
    logError: (info, args) => {
        logger.log('error', info, ...args);
    }
};