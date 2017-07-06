/**
 * Created by Administrator on 2017/6/29.
 */
export const  selectTeacherData = {
    grade : {
        queryType : [
            {
                name : '年级',
                queryItem:[
                  '一年级','二年级','三年级','四年级','五年级','六年级','初一','初二'
                    ,'初三','高一','高二','高三'
            ]}
        ],

    },
    area : {
        queryType : [
            {
                name : '区域',
                queryItem:[
                    '一年级','二年级','三年级','四年级','五年级','六年级','初一','初二'
                    ,'初三','高一','高二','高三'
                ]}
        ],
    },
    select : {
        target:"select",
        queryType : [
            {
                name : '科目',
                queryItem:[
                    '语文','数学','英语','物理','生物','历史','地理','政治'
                    ,'奥数','化学'
                ]},
            {
                name : '老师类型',
                queryItem:[
                    '重点学校老师','机构特约老师','大学生老师'

                ]},
            {
                name : '老师特点',
                queryItem:[
                    '细心耐心','杯赛经验','毕业班','深入浅出','小升初','海外留学','备课认真','无微不至'
                    ,'十年教龄','经验丰富','上课准时','提分高手'
                ]},
            {
                name : '性别',
                queryItem:[
                    '男','女','大学生老师'
                ]}
        ],
    }
}