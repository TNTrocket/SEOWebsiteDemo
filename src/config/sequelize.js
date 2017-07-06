/**
 * Created by tseian on 20/04/2017.
 */
let config = require("./config");
let Sequelize = require("sequelize");
let sequelizeInstance = new Sequelize(
  config.sequelize.database, config.sequelize.userName, config.sequelize.password,
  {
    port: config.sequelize.port,
    host: config.sequelize.host,
    dialect: config.sequelize.dialect,
    pool: {
      max: config.sequelize.pool.max,
      min: config.sequelize.pool.min,
      idle: config.sequelize.pool.idle
    }
  });

module.exports = sequelizeInstance;
