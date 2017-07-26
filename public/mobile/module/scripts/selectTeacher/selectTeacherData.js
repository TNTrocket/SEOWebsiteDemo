/**
 * Created by Administrator on 2017/6/29.
 */
export const  selectTeacherData = {
    grade : {
        queryType : [
            {
                name : '年级',
                queryItem:[
                    { itemName:'一年级',code:"grade1"},
                    { itemName:'二年级',code:"grade2"},
                    { itemName:'三年级',code:"grade3"},
                    { itemName:'四年级',code:"grade4"},
                    { itemName:'五年级',code:"grade5"},
                    { itemName:'六年级',code:"grade6"},
                    { itemName:'初一',code:"grade7"},
                    { itemName:'初二',code:"grade8"},
                    { itemName:'初三',code:"grade9"},
                    { itemName:'高一',code:"grade10"},
                    { itemName:'高二',code:"grade11"},
                    { itemName:'高三',code:"grade12"}
                ],
                category: 'selectGrade'
            }
        ],

    },
    area : {
        queryType : [
            {
                name : '区域',
                queryItem:[
                    { itemName:'一年级',code:"grade1"},
                    { itemName:'二年级',code:"grade2"},
                    { itemName:'三年级',code:"grade3"},
                    { itemName:'四年级',code:"grade4"},
                    { itemName:'五年级',code:"grade5"},
                    { itemName:'六年级',code:"grade6"},
                    { itemName:'初一',code:"grade7"},
                    { itemName:'初二',code:"grade8"},
                    { itemName:'初三',code:"grade9"},
                    { itemName:'高一',code:"grade10"},
                    { itemName:'高二',code:"grade11"},
                    { itemName:'高三',code:"grade12"}
                ],
                category: 'selectArea'
            }
        ],
    },
    select : {
        target:"select",
        queryType : [
            {
                name : '科目',
                queryItem:[
                   { code: 'chinese', itemName: '语文', id: 13 },
                   { code: 'math', itemName: '数学', id: 14 },
                   { code: 'english', itemName: '英语', id: 15 },
                   { code: 'physics', itemName: '物理', id: 16 },
                   { code: 'chemistry', itemName: '化学', id: 17 },
                   { code: 'biology', itemName: '生物', id: 18 },
                   { code: 'politics', itemName: '政治', id: 19 },
                   { code: 'history', itemName: '历史', id: 20 },
                   { code: 'geography', itemName: '地理', id: 21 },
                   { code: 'olympic_math', itemName: '奥数', id: 22 }
                ],
                category: 'selectSubject'
            },
            {
                name : '老师类型',
                queryItem:[
                    { itemName: '重点学校名师', type: 1,code:"point_school_teacher" },
                    { itemName: '机构特约老师', type: 2,code:"organization_teacher" },
                    { itemName: '大学生老师', type: 3,code:"university_student_teacher" }
                ],
                category: 'selectTeacherType'
            },
            {
                name : '老师特点',
                queryItem:[
                     { itemName: "细心耐心", id: 1 ,code:"xixinnaixin"},
                     { itemName: '杯赛经验', id: 2 ,code:"beisaijingyan"},
                     { itemName: '毕业班', id: 3 ,code:"biyeban"},
                     { itemName: '深入浅出', id: 4 ,code:"shengruqianchu"},
                     { itemName: '小升初', id: 5,code:"xiaoshengchu" },
                     { itemName: '海外留学', id: 6,code:"haiwailiuxue" },
                     { itemName: '备课认真', id: 7,code:"beikerenzhen" },
                     { itemName: '无微不至', id: 8 ,code:"wuweibuzhi"},
                     { itemName: '十年教龄', id: 9 ,code:"shinianjiaoling"},
                     { itemName: '备课认真', id: 10,code:"jingyanfengfu" },
                     { itemName: '上课准时', id: 11,code:"shangkezhunshi" },
                     { itemName: '提分高手', id: 12,code:"tifengaoshou" }
                ],
                category: 'selectTeacherFeature'
            },
            {
                name : '性别',
                queryItem:[
                     { itemName: '男', type: 1 ,code:"male" },
                     { itemName: '女', type: 0 ,code:"female"}
                ],
                category: 'selectTeacherGender'
            }
        ],
    }
}
export  const orderbyData = {
    auto:"智能排序",
    goodComment: "评价最好",
    highPrice :"价格最高",
    lowPrice : "价格最低",
    longCource :"课时最长",
    grade1: "一年级",
    grade2: "二年级",
    grade3: "三年级",
    grade4: "四年级",
    grade5: "五年级",
    grade6: "六年级",
    grade7: "初一",
    grade8: "初二",
    grade9: "初三",
    grade10: "高一",
    grade11: "高二",
    grade12: "高三",
}