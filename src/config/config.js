/**
 * Created by tseian on 20/04/2017.
 */
let config = null;
if (process && process.env && process.env.NODE_ENV) {
  config = require("./env/" + process.env.NODE_ENV + '.js');
  console.log(process.env.NODE_ENV);
} else {
  config = require("./env/development");
  console.log('development');
}
module.exports = config;
