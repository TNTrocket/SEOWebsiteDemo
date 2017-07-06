/**
 * Created by tseian on 26/06/2017.
 */
let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let TeacherTags = sequelize.define("TeacherTags", {
  tt_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  tt_teacher_id: { type: Sequelize.INTEGER },
  tt_tag_id: { type: Sequelize.INTEGER },
  tt_status: { type: Sequelize.INTEGER },
  tt_create_time: { type: Sequelize.BIGINT },
  tt_update_time: { type: Sequelize.BIGINT }
}, {
  tableName: 'tbl_teacher_tags',
  timestamps: false
});

module.exports = TeacherTags;
