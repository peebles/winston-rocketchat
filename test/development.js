const winston = require( 'winston' );
require( '../lib/rc' );

const transport = new winston.transports.RocketChat({
  handleExceptions: true,
  humanReadableUnhandledException: true,

  host: '192.168.99.100',
  ssl: false,
  user: 'logger',
  pass: 'logger',
  room: 'logs',
  program: 'myscript'
});

// Not required, but demonstrates how to monkey with
// the final output.
const myFormat = winston.format.printf(info => {
  info.message = `>>> ${info.message}`;        // modify the text
  info.env = process.env.NODE_ENV || 'local';  // add some metadata
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'right meow!' }),
    myFormat,
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    transport
  ]
});

logger.info( 'The first message' );
logger.error( 'An error with meta:', { meta: "data" }, () => {} );
//let foo = bar;

setTimeout( () => {
  process.exit(0);
}, 1000 );
