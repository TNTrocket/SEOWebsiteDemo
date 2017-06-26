/**
 * Created by tseian on 23/06/2017.
 */


let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let Enumeration = sequelize.define("Enumeration", {
  e_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  e_name: { type: Sequelize.STRING(500) },
  e_type_code: { type: Sequelize.STRING(30) },
  e_enu_code: { type: Sequelize.STRING(30) }
}, {
  tableName: 'tbl_enumeration',
  timestamps: false
});

module.exports = Enumeration;