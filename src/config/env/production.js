/**
 * Created by tseian on 20/04/2017.
 */


module.exports = {
  app: {
    env: 'production',
    port: 3030,
    secret: '38b5e45908a64c6c94615f4371d348bf',
    name: "选师无忧",
    poxyHost: "http://120.24.63.6:3035",
    viewCache : true
  },
  sequelize: {
    host: '39.108.86.180',
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