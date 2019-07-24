const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys =require('../config/keys');

const redisUrl = keys.redisUrl ; 
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options ={}){
    this.useCache = true;
    this.topKey = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function (){
    
    if(!this.useCache){
        return await exec.apply(this, arguments);
    }
    const key = JSON.stringify({...this.getQuery(),collection: this.mongooseCollection.name});
    
    const cacheValue = await client.hget(this.topKey, key);

    if(cacheValue) { //array of blogs not just one
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) 
            ? ( doc.map(instance =>new this.model(instance)) )
            : (new this.model (doc) );
    };
    const result = await exec.apply(this, arguments);
    client.hset(this.topKey, key, JSON.stringify(result));
    return result;
};

module.exports = {
    clearHash(topKey){
        client.del(JSON.stringify(topKey))
    }
}