/**
 * Created by tseian on 23/06/2017.
 */

module.exports = {
  app: {
    env: 'devOnLine',
    port: 3030,
    secret: '38b5e45908a64c6c94615f4371d348bf',
    name: "选师无忧"
  },
  sequelize: {
    host: '127.0.0.1',
    userName: 'ian',
    password: 'xuanshi@2017',
    database: 'xswy_web_index',
    port: '3306',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
};
