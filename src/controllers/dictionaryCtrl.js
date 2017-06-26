/**
 * Created by tseian on 21/06/2017.
 */

module.exports = {

  articleType: {
    sxzx: { code: 1, name: '升学资讯' },
    wyzx: { code: 2, name: '无忧资讯' },
    jzwd: { code: 3, name: '家长问答' },
    zlxz: { code: 4, name: '资料下载' },
  },


  careFreeInfo: {
    '0': { code: 0, name: '无忧资讯' },
    sxgl: { code: 5, name: '升学攻略' },
    gkzn: { code: 6, name: '高考指南' },
    bsxx: { code: 7, name: '杯赛信息' },
    jzxd: { code: 8, name: '家长心得' },
    qzcf: { code: 9, name: '亲子厨房' }
  },
  gradeEnumeration: {
    GRADE1: { code: 'GRADE1', name: '一年级' },
    GRADE2: { code: 'GRADE2', name: '二年级' },
    GRADE3: { code: 'GRADE3', name: '三年级' },
    GRADE4: { code: 'GRADE4', name: '四年级' },
    GRADE5: { code: 'GRADE5', name: '五年级' },
    GRADE6: { code: 'GRADE6', name: '六年级' },
    GRADE7: { code: 'GRADE7', name: '七年级' },
    GRADE8: { code: 'GRADE8', name: '八年级' },
    GRADE9: { code: 'GRADE9', name: '九年级' },
    GRADE10: { code: 'GRADE10', name: '高一' },
    GRADE11: { code: 'GRADE11', name: '高二' },
    GRADE12: { code: 'GRADE12', name: '高三' },

  },

  subjectEnumeration: {
    CHINESE: { code: 'CHINESE', name: '语文' },
    MATH: { code: 'MATH', name: '数学' },
    ENGLISH: { code: 'ENGLISH', name: '英语' },
    PHYSICS: { code: 'PHYSICS', name: '物理' },
    CHEMISTRY: { code: 'CHEMISTRY', name: '化学' },
    BIOLOGY: { code: 'BIOLOGY', name: '生物' },
    POLITICS: { code: 'POLITICS', name: '政治' },
    HISTORY: { code: 'HISTORY', name: '历史' },
    GEOGRAPHY: { code: 'GEOGRAPHY', name: '地理' },
    OLYMPIC_MATH: { code: 'OLYMPIC_MATH', name: '奥数' },
  },

  /*


   23	真题试卷	MATERIAL	TRUE_EXAM
   24	模拟试题	MATERIAL	IMITATE_EXAM
   25	教辅材料	MATERIAL	SUPPORT
   26	面试攻略	MATERIAL	INTERVIEW
   27	学科指南	MATERIAL	SUBJECT_GUID
   28	升学攻略	INFO	ENTER_HIGER_GUID
   29	高考指南	INFO	ENTER_UNIVERSITY_GUID
   30	杯赛信息	INFO	COMPETE
   31	家长心得	INFO	PARENT_EXPERIENCE
   32	亲子厨房	INFO	PARENT_KID_KITCHEN
   33	家长问答		PARENT_ASK_ANSWER
   34	资料下载		MATERIAL
   35	无忧资讯		INFO
   */

  informationList: {
    listH1: "information",
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
        h2: "问答类型"
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
        h2: "无忧资讯",
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
  }
};
