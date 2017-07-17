/**
 * Created by tseian on 26/06/2017.
 */
let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let Teacher = sequelize.define("Teacher", {
  t_id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  t_init_id: { type: Sequelize.INTEGER },
  t_headimg: { type: Sequelize.STRING(200) },
  t_name: { type: Sequelize.STRING(50) },
  t_gender: { type: Sequelize.INTEGER },
  t_teach_age: { type: Sequelize.INTEGER },
  t_good_comment: { type: Sequelize.INTEGER },
  t_mid_comment: { type: Sequelize.INTEGER },
  t_bad_comment: { type: Sequelize.INTEGER },

  t_comment: { type: Sequelize.TEXT },

  t_course_total: { type: Sequelize.INTEGER },
  t_price: { type: Sequelize.INTEGER },
  t_subject: { type: Sequelize.INTEGER },
  t_case: { type: Sequelize.TEXT },
  t_province_id: { type: Sequelize.INTEGER },
  t_city_id: { type: Sequelize.INTEGER },
  t_district_id: { type: Sequelize.INTEGER },

  t_introduction: { type: Sequelize.TEXT },
  t_university: { type: Sequelize.STRING(50) },
  t_type: { type: Sequelize.INTEGER },
  t_status: { type: Sequelize.INTEGER },
  t_update_time: { type: Sequelize.BIGINT },
  t_create_time: { type: Sequelize.BIGINT }
}, {
  tableName: 'teacher',
  timestamps: false
});


module.exports = Teacher;