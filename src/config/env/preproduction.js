/**
 * Created by tseian on 20/04/2017.
 */
/**
 * Created by tseian on 15/06/2017.
 */
module.exports = {
  app: {
    env: 'preproduction',
    port: 3030,
    secret: '38b5e45908a64c6c94615f4371d348bf',
    name: "选师无忧",
    poxyHost: "",
    viewCache : true
  },
  sequelize: {
    host: '',
    userName: '',
    password: '',
    database: '',
    port: '',
    dialect: '',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
};