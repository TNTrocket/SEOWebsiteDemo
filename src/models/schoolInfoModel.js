/**
 * Created by tseian on 29/06/2017.
 */

let Sequelize = require("sequelize");
let sequelize = require("../config/sequelize");
let SchoolInfo = sequelize.define("SchoolInfo", {
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING(500) },
  header_image_url: { type: Sequelize.STRING(255) },
  category: { type: Sequelize.STRING(255) },

  school_type: { type: Sequelize.INTEGER },
  city: { type: Sequelize.STRING(255) },
  region: { type: Sequelize.STRING(255) },

  street: { type: Sequelize.STRING(255) },
  main_page: { type: Sequelize.STRING(255) },
  phone: { type: Sequelize.STRING(255) },

  latitude: { type: Sequelize.DOUBLE },
  longitude: { type: Sequelize.DOUBLE },
  class_count: { type: Sequelize.STRING(255) },

  recruit_scope: { type: Sequelize.TEXT },
  recruit_plan: { type: Sequelize.TEXT },
  recruit_condition: { type: Sequelize.TEXT },

  recruit_resource: { type: Sequelize.TEXT },
  score_line: { type: Sequelize.TEXT },
  college_entrance_examination_score_line: { type: Sequelize.TEXT },

  is_recommended: { type: Sequelize.INTEGER },
  targets: { type: Sequelize.TEXT },

  entirety_score: { type: Sequelize.INTEGER },
  teacher_score: { type: Sequelize.INTEGER },
  teach_score: { type: Sequelize.INTEGER },

  hardware_score: { type: Sequelize.INTEGER },
  level: { type: Sequelize.STRING(255) },
  desc: { type: Sequelize.TEXT },

  address: { type: Sequelize.TEXT },

  entrance_way: { type: Sequelize.TEXT },
  attention: { type: Sequelize.INTEGER },

  created_at: { type: Sequelize.DATE },
  updated_at: { type: Sequelize.DATE },

}, {
  tableName: 'tbl_school_info',
  timestamps: false
});

module.exports = SchoolInfo;
