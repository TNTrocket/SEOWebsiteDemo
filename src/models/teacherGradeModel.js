/**
 * Created by tseian on 27/06/2017.
 */

let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let TeacherGrade = sequelize.define("TeacherGrade", {
  tg_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  tg_teacher_id: { type: Sequelize.INTEGER },
  tg_grade_id: { type: Sequelize.INTEGER },
  tg_status: { type: Sequelize.INTEGER },
  tg_update_time: { type: Sequelize.BIGINT },
  tg_create_time: { type: Sequelize.BIGINT }
}, {
  tableName: 'tbl_teacher_grade',
  timestamps: false
});


module.exports = TeacherGrade;
