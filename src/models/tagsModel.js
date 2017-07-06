/**
 * Created by tseian on 23/06/2017.
 */
let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let Tags = sequelize.define("Tags", {
  t_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  t_name: { type: Sequelize.STRING(500) },
  t_status: { type: Sequelize.INTEGER },

  t_update_time: { type: Sequelize.BIGINT },
  t_create_time: { type: Sequelize.BIGINT }
}, {
  tableName: 'tbl_tags',
  timestamps: false
});

module.exports = Tags;


