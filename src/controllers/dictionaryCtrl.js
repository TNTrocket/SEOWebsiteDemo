/**
 * Created by tseian on 21/06/2017.
 */
const TagsModel = require('../models/tagsModel');
const BaseCtrl = require('../controllers/baseCtrl');
const redis = require('../config/redis');
const ArticleTypesModel = require('../models/articleTypesModel');


class DictionaryCtrl extends BaseCtrl {

  get articleType() {
    return {
      sxzx: { id: 1, name: '升学资讯', code: '' },
      wyzx: { id: 2, name: '无忧资讯', code: 'INFO' },
      jzwd: { id: 3, name: '家长问答', code: 'PARENT_ASK_ANSWER' },
      zlxz: { id: 4, name: '资料下载', code: 'MATERIAL' }
    };
  }

  /**
   * 无忧资讯的文章类型
   * @returns {{}}
   */
  async careFreeInfos(status) {
    status = status || 1;
    let articleTypes = await ArticleTypesModel.findAll({ where: { at_status: status, at_parent_id: 2 } });
    let tem = {};
    for (let at of articleTypes) {
      at.dataValues.code = at.at_url;
      at.dataValues.name = at.at_name;
      at.dataValues.id = at.at_id;
      tem[at.at_url] = at.dataValues;
    }
    return tem;
  }

  get gradeEnumeration() {
    return {
      grade1: { code: 'GRADE1', name: '一年级', id: 1 },
      grade2: { code: 'GRADE2', name: '二年级', id: 2 },
      grade3: { code: 'GRADE3', name: '三年级', id: 3 },
      grade4: { code: 'GRADE4', name: '四年级', id: 4 },
      grade5: { code: 'GRADE5', name: '五年级', id: 5 },
      grade6: { code: 'GRADE6', name: '六年级', id: 6 },
      grade7: { code: 'GRADE7', name: '初一', id: 7 },
      grade8: { code: 'GRADE8', name: '初二', id: 8 },
      grade9: { code: 'GRADE9', name: '初三', id: 9 },
      grade10: { code: 'GRADE10', name: '高一', id: 10 },
      grade11: { code: 'GRADE11', name: '高二', id: 11 },
      grade12: { code: 'GRADE12', name: '高三', id: 12 },
    };
  }

  get gradeIDName() {
    return {
      1: { code: 'GRADE1', name: '一年级' },
      2: { code: 'GRADE2', name: '二年级' },
      3: { code: 'GRADE3', name: '三年级' },
      4: { code: 'GRADE4', name: '四年级' },
      5: { code: 'GRADE5', name: '五年级' },
      6: { code: 'GRADE6', name: '六年级' },
      7: { code: 'GRADE7', name: '初一' },
      8: { code: 'GRADE8', name: '初二' },
      9: { code: 'GRADE9', name: '初三' },
      10: { code: 'GRADE10', name: '高一' },
      11: { code: 'GRADE11', name: '高二' },
      12: { code: 'GRADE12', name: '高三' }
    };
  }

  get subjectEnumeration() {
    return {
      chinese: { code: 'CHINESE', name: '语文', id: 13 },
      math: { code: 'MATH', name: '数学', id: 14 },
      english: { code: 'ENGLISH', name: '英语', id: 15 },
      physics: { code: 'PHYSICS', name: '物理', id: 16 },
      chemistry: { code: 'CHEMISTRY', name: '化学', id: 17 },
      biology: { code: 'BIOLOGY', name: '生物', id: 18 },
      politics: { code: 'POLITICS', name: '政治', id: 19 },
      history: { code: 'HISTORY', name: '历史', id: 20 },
      geography: { code: 'GEOGRAPHY', name: '地理', id: 21 },
      olympic_math: { code: 'OLYMPIC_MATH', name: '奥数', id: 22 },
    };
  }

  get subjectIDName() {
    return {
      13: { code: 'CHINESE', name: '语文' },
      14: { code: 'MATH', name: '数学' },
      15: { code: 'ENGLISH', name: '英语' },
      16: { code: 'PHYSICS', name: '物理' },
      17: { code: 'CHEMISTRY', name: '化学' },
      18: { code: 'BIOLOGY', name: '生物' },
      19: { code: 'POLITICS', name: '政治' },
      20: { code: 'HISTORY', name: '历史' },
      21: { code: 'GEOGRAPHY', name: '地理' },
      22: { code: 'OLYMPIC_MATH', name: '奥数' },
    };
  }

  /**
   * 无忧资讯文章类型
   * @returns {{}}
   */
  async infoEnumeration() {

    let articleTypes = await ArticleTypesModel.findAll({ where: { at_status: 1, at_parent_id: 2 } });
    let tem = {};
    for (let at of articleTypes) {
      at.dataValues.code = at.at_enu_code2.toLowerCase();
      at.dataValues.name = at.at_name;
      at.dataValues.id = at.at_id;
      tem[at.at_url.toLowerCase()] = at.dataValues;
    }
    return tem;
  }

  get teacherTypes() {
    return {
      point_school_teacher: { name: '重点学校名师', type: 1 },
      organization_teacher: { name: '机构特约老师', type: 2 },
      university_student_teacher: { name: '大学生老师', type: 3 }
    };
  }

  get gender() {
    return {
      male: { name: '男', type: 1 },
      female: { name: '女', type: 0 }
    };
  }


  get teacherTagIDName() {


    return {
      1: { code: 'xixinnaixin', name: "细心耐心" },
      2: { code: 'beisaijingyan', name: '杯赛经验' },
      3: { code: 'biyeban', name: '毕业班' },
      4: { code: 'shengruqianchu', name: '深入浅出' },
      5: { code: 'xiaoshengchu', name: '小升初' },
      6: { code: 'haiwailiuxue', name: '海外留学' },
      7: { code: 'beikerenzhen', name: '备课认真' },
      8: { code: 'wuweibuzhi', name: '无微不至' },
      9: { code: 'shinianjiaoling', name: '十年教龄' },
      10: { code: 'jingyanfengfu', name: '备课认真' },
      11: { code: 'shangkezhunshi', name: '上课准时' },
      12: { code: 'tifengaoshou', name: '提分高手' },
    };
  }

  async teacherTagIDNames() {


    // return {
    //   1: { code: 'xixinnaixin', name: "细心耐心" },
    //   2: { code: 'beisaijingyan', name: '杯赛经验' },
    //   3: { code: 'biyeban', name: '毕业班' },
    //   4: { code: 'shengruqianchu', name: '深入浅出' },
    //   5: { code: 'xiaoshengchu', name: '小升初' },
    //   6: { code: 'haiwailiuxue', name: '海外留学' },
    //   7: { code: 'beikerenzhen', name: '备课认真' },
    //   8: { code: 'wuweibuzhi', name: '无微不至' },
    //   9: { code: 'shinianjiaoling', name: '十年教龄' },
    //   10: { code: 'jingyanfengfu', name: '备课认真' },
    //   11: { code: 'shangkezhunshi', name: '上课准时' },
    //   12: { code: 'tifengaoshou', name: '提分高手' },
    // };
  }



  get schoolCategory() {
    return {
      school: { value: ['民办小学', '公办小学'], code: 'school', name: '小学' },
      middle: { value: ['民办中学', '公办中学'], code: 'middle', name: '初中' },
      high: { value: ['民办中学', '公办中学'], code: 'high', name: '高中' }
    };
  }

  get schoolLevel() {
    return {
      province: { name: '省一级', code: 'province' },
      city: { name: '市一级', code: 'city' },
      district: { name: '区一级', code: 'district' }
    };
  }

  get informationList() {
    return {
      parentsQaList: {
        headerTxt: {
          title: "升学资讯",
          h2: "家长问答"
        },
        queryType: {
          sumTxt: "问答类型",
          queryItem: [{
            inputName: "grade",
            type: "类目：",
            item: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"]
          }]
        }
      },
      schoolList: {
        headerTxt: {
          title: "升学资讯",
          h2: "学校列表"
        },
        queryType: {
          sumTxt: "问答类型",
          queryItem: [{
            type: "年级：",
            item: ["小学", "初中", "高中"]
          }, {
            type: "地区：",
            item: ["越秀区", "天河区", "荔湾区", "越秀区", "天河区", "海珠区", "番禺区", "黄浦区", "白云区", "花都区", "萝岗区"]
          },
            {
              type: "级别：",
              item: ["省一级", "市一级", "区一级"]
            }
          ]
        }
      },
      article: {
        headerTxt: {
          title: "升学资讯",
          h2: "正文"
        }
      },
      schoolDetail: {
        headerTxt: {
          title: "升学资讯",
          h2: "学校列表"
        }
      },
      studyNewsList: {
        headerTxt: {
          title: "升学资讯",
          h2: "无忧资讯"
        },

        queryType: {
          sumTxt: "资讯类型",
          queryItem: [{
            inputName: "newsType",
            type: "类目：",
            item: ["不限", "升学攻略", "高考指南", "杯赛信息", "家长心得", "亲子厨房"]
          }]
        }
      },
      dataDownloadList: {
        headerTxt: {
          title: "升学资讯",
          h2: "资料下载"
        },

        queryType: {
          sumTxt: "问答类型",
          queryItem: [{
            inputName: "grade",
            type: "年级：",
            item: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"]
          },
            {
              inputName: "subject",
              type: "科目：",
              item: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理", "奥数"]
            }
          ]
        }
      },
    };
  }

  get defaultCity() {
    return {
      a_id: 440100,
      a_name: '广州市',
      a_shortName: '广州',
      a_pinyin: 'Guangzhou',
      a_parentID: 440000
    };
  }

  get areaLevel() {
    return {
      country: { name: 'country', level: 0 },
      province: { name: 'province', level: 1 },
      city: { name: 'city', level: 2 },
      district: { name: 'district', level: 3 }
    };
  }

  get s_a_grade_enu() {
    return {
      1: { enu_id: 1, aNO: 'a1', code: 'GRADE1', name: '一年级' },
      2: { enu_id: 2, aNO: 'a2', code: 'GRADE2', name: '二年级' },
      3: { enu_id: 3, aNO: 'a3', code: 'GRADE3', name: '三年级' },
      4: { enu_id: 4, aNO: 'a4', code: 'GRADE4', name: '四年级' },
      5: { enu_id: 5, aNO: 'a5', code: 'GRADE5', name: '五年级' },
      6: { enu_id: 6, aNO: 'a6', code: 'GRADE6', name: '六年级' },
      7: { enu_id: 7, aNO: 'a7', code: 'GRADE7', name: '初一' },
      8: { enu_id: 8, aNO: 'a8', code: 'GRADE8', name: '初二' },
      9: { enu_id: 9, aNO: 'a9', code: 'GRADE9', name: '初三' },
      10: { enu_id: 10, aNO: 'a10', code: 'GRADE10', name: '高一' },
      11: { enu_id: 11, aNO: 'a11', code: 'GRADE11', name: '高二' },
      12: { enu_id: 12, aNO: 'a12', code: 'GRADE12', name: '高三' }
    };
  }

  get s_b_subject_enu() {
    return {
      1: { enu_id: 13, bNO: 'b1', code: 'CHINESE', name: '语文' },
      2: { enu_id: 14, bNO: 'b2', code: 'MATH', name: '数学' },
      3: { enu_id: 15, bNO: 'b3', code: 'ENGLISH', name: '英语' },
      4: { enu_id: 16, bNO: 'b4', code: 'PHYSICS', name: '物理' },
      5: { enu_id: 17, bNO: 'b5', code: 'CHEMISTRY', name: '化学' },
      6: { enu_id: 18, bNO: 'b6', code: 'BIOLOGY', name: '生物' },
      7: { enu_id: 19, bNO: 'b7', code: 'POLITICS', name: '政治' },
      8: { enu_id: 20, bNO: 'b8', code: 'HISTORY', name: '历史' },
      9: { enu_id: 21, bNO: 'b9', code: 'GEOGRAPHY', name: '地理' },
      10: { enu_id: 22, bNO: 'b10', code: 'OLYMPIC_MATH', name: '奥数' }
    };
  }

  get s_d_gender() {
    return {
      0: { dNO: 'd0', name: '男', code: 0 },
      1: { dNO: 'd1', name: '女', code: 1 }
    };
  }

  get s_e_type() {
    return {
      1: { eNO: 'e1', name: '重点学校名师', type_id: 1 },
      2: { eNO: 'e2', name: '机构特约老师', type_id: 2 },
      3: { eNO: 'e3', name: '大学生老师', type_id: 3 }
    };
  }

  /**
   * 老师的所有标签 缓存在redis
   * @returns {{}}
   */
  async s_f_tag() {
    //redis 缓存
    let s_f_tags = {};
    let tags = await redis.hgetallAsync('teacherTags.1');
    let isOverOneDay = true;

    if (tags) { //一天
      isOverOneDay = new Date().getTime() - new Date(tags.cachedDate).getTime() > 86400000;
    }

    if (!tags || isOverOneDay) {
      tags = await TagsModel.findAll({ where: { t_status: 1 }, order: 't_id asc' });
      let now = new Date();
      for (let index = 0; index < tags.length; index++) {
        let i = tags[index];

        let tem = {};
        tem.t_pinyin = i.t_pinyin;
        tem.fNO = 'f' + i.t_id;
        tem.t_id = i.t_id;
        tem.t_name = i.t_name;
        tem.t_status = i.t_status;
        tem.t_update_time = i.t_update_time;
        tem.t_create_time = i.t_create_time;
        tem.cachedDate = now;
        s_f_tags[index + 1] = tem;
        await redis.hmsetAsync('teacherTags.' + (index + 1), tem);
      }
      await redis.setAsync('tagsTotal', tags.length);
      console.log('将所有老师的标签数据写入redis');
    } else {
      let tagsTotal = await redis.getAsync('tagsTotal');
      for (let index = 1; index <= tagsTotal; index++) {
        s_f_tags[index] = await redis.hgetallAsync('teacherTags.' + index);
      }
      console.log('从redis 缓存中取出老师标签信息');
    }
    return s_f_tags;
  }

  get s_g_order_enu() {
    return {
      1: { gNO: 'g1', code: 'auto', name: "智能排序" },
      2: { gNO: 'g2', code: 'goodComment', name: '评价最好' },
      3: { gNO: 'g3', code: 'highPrice', name: '价格最好' },
      4: { gNO: 'g4', code: 'lowPrice', name: '价格最低' },
      5: { gNO: 'g5', code: 'longCource', name: '课时最长' }
    };
  }

  get s_a_school() {
    return {
      1: { aNO: 'a1', value: ['民办小学', '公办小学'], code: 'school', name: '小学' },
      2: { aNO: 'a2', value: ['民办中学', '公办中学'], code: 'middle', name: '初中' },
      3: { aNO: 'a3', value: ['民办中学', '公办中学'], code: 'high', name: '高中' }
    };
  }

  get s_c_school_level() {
    return {
      1: { cNO: 'c1', name: '省一级', code: 'province' },
      2: { cNO: 'c2', name: '市一级', code: 'city' },
      3: { cNO: 'c3', name: '区一级', code: 'district' }
    };
  }

}

module.exports = new DictionaryCtrl();