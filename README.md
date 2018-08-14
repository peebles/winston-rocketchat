# winston-rocketchat

A [Rocket.Chat](https://rocket.chat/) transport for [Winston](https://github.com/winstonjs/winston).

Send log statements to a Rocket.Chat room.

## Installation

```sh
npm install winston
npm install winston-rocketchat
```

## Usage (winston 3.x)

```javascript
const winston = require( 'winston' );
require( 'winston-rocketchat' );

const rcTransport = new winston.transports.RocketChat({
  host: '192.168.99.100',
  ssl: false,
  user: 'logger',
  pass: 'logger',
  room: 'logs',
  program: 'myscriptname'
});

// Not required, but demonstrates how to monkey with
// the final output.
const myFormat = winston.format.printf(info => {
  info.message = `>>> ${info.message}`;        // modify the text
  info.env = process.env.NODE_ENV || 'local';  // add some metadata
});

const logger = winston.createLogger({
  format: winston.format.combine(
    myFormat,
    winston.format.simple() // for Console
  ),
  transports: [
    new winston.transports.Console(),
    rcTransport
  ]
});

logger.info( 'My first log message!' );
```

The rocket.chat room "logs" would need to have been created and should be a channel that the specified user (logger/logger in this example) 
can write to.  The message will look like:

    2018-08-14T01:09:22.539Z myscriptname [info]: >>> My first log message! {"env":"local"}

## Usage (winston 2.x)

