/**
 * Created by tseian on 15/06/2017.
 */
module.exports = {
  app: {
    env: 'development',
    port: 3030,
    secret: '38b5e45908a64c6c94615f4371d348bf',
    name: "选师无忧",
    poxyHost: "http://192.168.1.27:3035",
    viewCache: false
  },
  sequelize: {
    host: '127.0.0.1',
    userName: 'root',
    password: '1234',
    database: 'xswy_web_index',
    port: '3306',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  },
  redis: {
    port: 6379,
    host: "127.0.0.1",
    options: { db: 6 }
  },
  jwt: {
    access: {
      key: '38b5e45908a64c6c94615f4371d348bf',
      expires: 24 * 60
    },
    refresh: {
      key: '38b5e45908a64c6c94615f4371d348bf',
      expires: 24 * 60
    }
  }
};