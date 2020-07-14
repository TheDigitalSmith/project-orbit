const winston = require("winston");

const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, prettyPrint, json } = format;

const logger = createLogger({
  format: combine(timestamp(), prettyPrint(), json()),
  transports: [
    new transports.Console({
      level: "info",
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({
      filename: "unhandledExceptions.log",
    }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex;
});

module.exports = logger;
