/**
 * Created by tseian on 26/06/2017.
 */

let sequelize = require("../config/sequelize");
let Sequelize = require('sequelize');
let Area = sequelize.define("Area", {
  a_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  a_name: { type: Sequelize.STRING(500) },
  a_parentID: { type: Sequelize.INTEGER },
  a_shortName: { type: Sequelize.STRING(500) },
  a_level: { type: Sequelize.INTEGER },
  a_zipCode: { type: Sequelize.STRING(6) },
  a_pinyin: { type: Sequelize.STRING(50) },
  a_status: { type: Sequelize.INTEGER },

  a_updatedTime: { type: Sequelize.DATE },
  a_createdTime: { type: Sequelize.DATE },

}, {
  tableName: 'tbl_area',
  timestamps: false
});

module.exports = Area;
