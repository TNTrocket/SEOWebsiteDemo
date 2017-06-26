/**
 * Created by tseian on 15/06/2017.
 */

let sequelize = require("../config/sequelize");
let Sequelize = require('sequelize');

let Article = sequelize.define("Article", {
  a_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  a_title: { type: Sequelize.STRING(500) },
  a_keyword: { type: Sequelize.STRING(500) },
  a_description: { type: Sequelize.STRING(500) },
  a_content_title: { type: Sequelize.STRING(100) },
  a_content: { type: Sequelize.TEXT },
  a_images: { type: Sequelize.STRING(500) },
  a_source_url: { type: Sequelize.STRING(100) },
  a_enu_code1: { type: Sequelize.STRING(30) },
  a_enu_code2: { type: Sequelize.STRING(30) },
  a_enu_code3: { type: Sequelize.STRING(30) },
  a_type: { type: Sequelize.INTEGER(11) },
  a_createtime: { type: Sequelize.BIGINT },
  a_deletetime: { type: Sequelize.BIGINT },
  a_status: { type: Sequelize.INTEGER }
}, {
  tableName: 'tbl_articles',
  timestamps: false
});


module.exports = Article;