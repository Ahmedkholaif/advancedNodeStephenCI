const Buffer =require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

module.exports = (user)=>{
    
    // 5d2ef18c3c17ed2df9d39558
    // const id = '5d2ef18c3c17ed2df9d39558';
    //fake session id
    const sessionObject = {
        passport:{
            user : user._id.toString(),
        }
    };
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session='+ session);
    
    return {session,sig};
}