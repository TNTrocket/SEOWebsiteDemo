/**
 * Created by tseian on 02/08/2017.
 */

let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let Column = sequelize.define("Column", {
  c_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  c_name: { type: Sequelize.STRING(50) },
  c_level: { type: Sequelize.INTEGER },
  c_url: { type: Sequelize.STRING(200) },
  c_title: { type: Sequelize.STRING(500) },
  c_keywords: { type: Sequelize.STRING(500) },
  c_description: { type: Sequelize.STRING(500) },
  c_status: { type: Sequelize.INTEGER },
  c_create_time: { type: Sequelize.BIGINT },
  c_update_time: { type: Sequelize.BIGINT },
  c_create_by: { type: Sequelize.INTEGER },
  c_update_by: { type: Sequelize.INTEGER }
}, {
  tableName: 'tbl_column',
  timestamps: false
});

module.exports = Column;
