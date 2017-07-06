/**
 * Created by tseian on 26/06/2017.
 */
let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let Banner = sequelize.define("Banner", {
  b_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  b_status: { type: Sequelize.INTEGER },
  b_title: { type: Sequelize.STRING(32) },
  b_path: { type: Sequelize.STRING(256) },
  b_target: { type: Sequelize.STRING(256) },
  b_cityID: { type: Sequelize.INTEGER },
  b_sort: { type: Sequelize.INTEGER },
  b_remark: { type: Sequelize.STRING(512) },
  b_create_time: { type: Sequelize.BIGINT },
  b_update_time: { type: Sequelize.BIGINT }
}, {
  tableName: 'tbl_banner',
  timestamps: false
});

module.exports = Banner;