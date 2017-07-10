/**
 * Created by tseian on 26/06/2017.
 */

const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const informationList = dictionCtrl.informationList;
const assert = require('assert');
const teacherCtrl = require("../controllers/teacherCtrl");

/**
 * 获取老师列表
 * orderBy 顺序 grade 年级 district 区域
 * subject 科目 teacherType 老师类型  tags 老师特点
 */
router.get('/list/:orderBy/:grade/:district/:subject/:teacherType/:tags/:gender/:offset', async(ctx, next) => {
  let { orderBy, grade, district, subject, teacherType, gender, tags, offset } =ctx.params;
  if (tags != 'unlimit') {
    tags = tags.split("+");
  } else {
    tags = [];
  }
  offset = parseInt(offset);
  let params = { orderBy, grade, district, subject, teacherType, gender, tags, offset };
  let data = await teacherCtrl.listTeacher(params);
  console.log("teacherData======",data.list);
    data.renderType = "selectTeacher";
    return await ctx.render("selectTeacher", data)
});
/**
 * 通过老师ID 获取老师信息
 */
router.get('/:teacherID', async(ctx, next) => {
  let { teacherID } =ctx.params;
  assert(parseInt(teacherID), '参数不正确');
  teacherID = parseInt(teacherID);
  let teacher = await teacherCtrl.getTeacherInfo(teacherID);
  console.log(teacher);
  ctx.response.body = teacher;
  return;
});

module.exports = router;