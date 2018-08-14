const winston = require( 'winston' );
require( '../lib/rc' );

const rcTransport = new winston.transports.RocketChat({
  handleExceptions: true,
  humanReadableUnhandledException: true,

  host: '192.168.99.100',
  ssl: false,
  user: 'logger',
  pass: 'logger',
  room: 'logs',
  program: 'myscript'
});


let logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(),
    rcTransport
  ]
});


logger.info( 'The 2x message' );
logger.error( 'A 2x error with meta:', { meta: "data" }, () => {} );
//let foo = bar;

setTimeout( () => {
  process.exit(0);
}, 1000 );



