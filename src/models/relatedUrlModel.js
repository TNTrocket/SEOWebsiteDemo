/**
 * Created by tseian on 07/08/2017.
 */
let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let RelatedUrl = sequelize.define("RelatedUrl", {
  ru_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  ru_name: { type: Sequelize.STRING(50) },
  ru_url: { type: Sequelize.STRING(200) },
  ru_status: { type: Sequelize.INTEGER },
  ru_create_by: { type: Sequelize.INTEGER },
  ru_update_by: { type: Sequelize.INTEGER },
  ru_create_time: { type: Sequelize.BIGINT },
  ru_update_time: { type: Sequelize.BIGINT }

}, {
  tableName: 'tbl_related_url',
  timestamps: false
});

module.exports = RelatedUrl;
