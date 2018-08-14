const { driver } = require('@rocket.chat/sdk');
const winston = require('winston');
const debug = require( 'debug' )('winston-rocketchat');

// support both 2.x and 3.x
let Transport;
try {
  Transport = require('winston-transport');
} catch(err) {
  Transport = winston.Transport;
}

class RocketChat extends Transport {

  get name() {
    return 'rocketchat';
  }

  constructor( options = {} ) {
    super( options );

    // rocket chat options
    ['host','user','pass','ssl','room'].forEach( (o) => {
      if ( options[o] === undefined ) throw( new Error( `must supply option "${o}"` ) );
      this[o] = options[o];
    });

    // additional options
    this.program = options.program || process.title;

    // capture rocket.chat sdk output
    const rcLogger = {
      info: () => {
	debug.apply( null, [...arguments] );
      },
      debug: () => {
	debug.apply( null, [...arguments] );
      },
      warn: () => {
	debug.apply( null, [...arguments] );
      },
      error: () => {
	debug.apply( null, [...arguments] );
      }
    };

    driver.useLog( rcLogger );
  }

  login() {
    if ( this.userid ) return Promise.resolve( this.userid );
    return Promise.resolve().then(() => {
      return driver.connect({ host: this.host, useSsl: this.ssl });
    }).then( () => {
      return driver.login({ username: this.user, password: this.pass });
    }).then( (userid) => {
      this.userid = userid;
      return this.userid;
    });
  }

  log( _compat_level, _compat_msg, info, cb ) {
    let clone = JSON.parse(JSON.stringify(info));

    // support 2.x and 3.x
    let message = (clone.message === undefined) ? _compat_msg : clone.message;
    delete clone.message;

    // support 2.x and 3.x
    let level = (clone.level === undefined) ? _compat_level : clone.level;
    delete clone.level;

    let timestamp = clone.timestamp || new Date().toISOString();
    delete clone.timestamp;

    let meta = Object.keys(clone).length ? JSON.stringify(clone) : '';
    
    let content = `${timestamp} ${this.program} [${level}]: ${message} ${meta}`;

    Promise.resolve().then( () => {
      return this.login();
    }).then( () => {
      return driver.sendToRoom( content, this.room );
    }).then(() => cb()).catch(cb);
  }
}
winston.transports.RocketChat = RocketChat;
module.exports = {
  RocketChat
};

