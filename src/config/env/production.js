/**
 * Created by tseian on 20/04/2017.
 */


module.exports = {
  app: {
    env: 'production',
    port: 3030,
    secret: '',
    name: "",
    poxyHost: "",
    viewCache: true
  },
  sequelize: {
    host: '',
    userName: '',
    password: '',
    database: '',
    port: '',
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
    options: {}
  },
};