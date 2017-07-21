/**
 * Created by tseian on 15/06/2017.
 */
module.exports = {
  app: {
    env: 'test',
    port: 3030,
    secret: '38b5e45908a64c6c94615f4371d348bf',
    name: "选师无忧",
    poxyHost: "http://192.168.1.27:3035",
    viewCache: false
  },
  sequelize: {
    host: '192.168.1.27',
    userName: 'root',
    password: 'my-secret-pw',
    database: 'xswy_web_index',
    port: '3326',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
};