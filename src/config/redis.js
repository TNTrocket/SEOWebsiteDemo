/**
 * Created by tseian on 31/07/2017.
 */

let bluebird = require('bluebird');


let config = require("./config");
let redis = require("redis"), client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function(err) {
  console.log('redis is error : ', err);
});

client.on("ready", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('redis is ready');
  }
});

module.exports = client;