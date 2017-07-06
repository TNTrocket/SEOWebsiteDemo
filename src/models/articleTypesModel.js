/**
 * Created by tseian on 15/06/2017.
 */

let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let ArticleType = sequelize.define("ArticleType", {
  at_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  at_name: { type: Sequelize.STRING(500) },
  at_parent_id: { type: Sequelize.INTEGER },
  at_enu_code1: { type: Sequelize.STRING(30) },
  at_enu_code2: { type: Sequelize.STRING(30) },
  at_enu_code3: { type: Sequelize.STRING(30) },
  at_status: { type: Sequelize.INTEGER },
  at_create_time: { type: Sequelize.BIGINT },
  at_update_time: { type: Sequelize.BIGINT },
}, {
  tableName: 'tbl_article_types',
  timestamps: false
});

module.exports = ArticleType;




