/**
 * Created by tseian on 15/06/2017.
 */

module.exports = {
    app: {
        env: 'development',
        port: 3030,
        secret: '38b5e45908a64c6c94615f4371d348bf',
        name: "选师无忧"
    },
    sequelize: {
        host: '192.168.1.27',
        userName: 'root',
        password: 'my-secret-pw',
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