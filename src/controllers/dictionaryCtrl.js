/**
 * Created by tseian on 21/06/2017.
 */

module.exports = {

  articleType: {
    sxzx: { id: 1, name: '升学资讯', code: '' },
    wyzx: { id: 2, name: '无忧资讯', code: 'INFO' },
    jzwd: { id: 3, name: '家长问答', code: 'PARENT_ASK_ANSWER' },
    zlxz: { id: 4, name: '资料下载', code: 'MATERIAL' }
  },


  careFreeInfo: {
    'unlimit': { code: 0, name: '不限', id: [0, 5, 6, 7, 8, 9] },
    sxgl: { code: 'sxgl', name: '升学攻略', id: 5 },
    gkzn: { code: 'gkzn', name: '高考指南', id: 6 },
    bsxx: { code: 'bsxx', name: '杯赛信息', id: 7 },
    jzxd: { code: 'jzxd', name: '家长心得', id: 8 },
    qzcf: { code: 'qzcf', name: '亲子厨房', id: 9 }
  },

  gradeEnumeration: {
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
  },

  gradeIDName: {
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
  },

  subjectEnumeration: {
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
  },

  subjectIDName: {
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
  },


  infoEnumeration: {
    enter_higer_guid: { code: 'ENTER_HIGER_GUID', name: '升学攻略', id: 5 },
    enter_university_guid: { code: 'ENTER_UNIVERSITY_GUID', name: '高考指南', id: 6 },
    compete: { code: 'COMPETE', name: '杯赛信息', id: 7 },
    parent_experience: { code: 'PARENT_EXPERIENCE', name: '家长心得', id: 8 },
    parent_kid_kitchen: { code: 'PARENT_KID_KITCHEN', name: '亲子厨房', id: 9 },
  },

  infoIDName: {
    5: { code: 'ENTER_HIGER_GUID', name: '升学攻略' },
    6: { code: 'ENTER_UNIVERSITY_GUID', name: '高考指南' },
    7: { code: 'COMPETE', name: '杯赛信息' },
    8: { code: 'PARENT_EXPERIENCE', name: '家长心得' },
    9: { code: 'PARENT_KID_KITCHEN', name: '亲子厨房' }
  },


  teacherTypes: {
    point_school_teacher: { name: '重点学校名师', type: 1 },
    organization_teacher: { name: '机构特约老师', type: 2 },
    university_student_teacher: { name: '大学生老师', type: 3 }
  },

  gender: {
    male: { name: '男', type: 1 },
    female: { name: '女', type: 0 }
  },


  //对应 tags表
  teacherTags: {
    xixinnaixin: { name: "细心耐心", id: 1 },
    beisaijingyan: { name: '杯赛经验', id: 2 },
    biyeban: { name: '毕业班', id: 3 },
    shengruqianchu: { name: '深入浅出', id: 4 },
    xiaoshengchu: { name: '小升初', id: 5 },
    haiwailiuxue: { name: '海外留学', id: 6 },
    beikerenzhen: { name: '备课认真', id: 7 },
    wuweibuzhi: { name: '无微不至', id: 8 },
    shinianjiaoling: { name: '十年教龄', id: 9 },
    jingyanfengfu: { name: '备课认真', id: 10 },
    shangkezhunshi: { name: '上课准时', id: 11 },
    tifengaoshou: { name: '提分高手', id: 12 },
  },

  teacherTagIDName: {
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
  },

  schoolCategory: {
    school: { value: ['民办小学', '公办小学'], code: 'school', name: '小学' },
    middle: { value: ['民办中学', '公办中学'], code: 'middle', name: '初中' },
    high: { value: ['民办中学', '公办中学'], code: 'high', name: '高中' }
  },

  schoolLevel: {
    province: { name: '省一级', code: 'province' },
    city: { name: '市一级', code: 'city' },
    district: { name: '区一级', code: 'district' }
  },

  informationList: {
    parentsQaList: {
      headerTxt: {
        title: "升学资讯",
        h2: "家长问答"
      },
      queryType: {
        sumTxt: "问答类型",
        queryItem: [
          {
            inputName: "grade",
            type: "类目：",
            item: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"]
          }
        ]
      }
    },
    schoolList: {
      headerTxt: {
        title: "升学资讯",
        h2: "学校列表"
      },
      queryType: {
        sumTxt: "问答类型",
        queryItem: [
          {
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
    studyNewsList: {
      headerTxt: {
        title: "升学资讯",
        h2: "无忧资讯"
      },

      queryType: {
        sumTxt: "资讯类型",
        queryItem: [
          {
            inputName: "newsType",
            type: "类目：",
            item: ["不限", "升学攻略", "高考指南", "杯赛信息", "家长心得", "亲子厨房"]
          }
        ]
      }
    },
    dataDownloadList: {
      headerTxt: {
        title: "升学资讯",
        h2: "资料下载"
      },

      queryType: {
        sumTxt: "问答类型",
        queryItem: [
          {
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
    article: {
      headerTxt: {
        title: "升学资讯",
        h3: "正文"
      }
    },
    schoolDetail: {
      headerTxt: {
        title: "升学资讯",
        h2: "学校列表",
        h3: "1"
      }
    }
  },
  defaultCity: {
    a_id: 440100,
    a_name: '广州市',
    a_shortName: '广州',
    a_pinyin: 'Guangzhou',
    a_parentID: 440000
  },

  cityLevel: {
    country: { name: 'country', level: 0 },
    province: { name: 'province', level: 1 },
    city: { name: 'city', level: 2 },
    district: { name: 'district', level: 3 }
  }
};
