/**
 * Created by tseian on 26/06/2017.
 */

const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const informationList = dictionCtrl.informationList;
const assert = require('assert');
const teacherCtrl = require("../controllers/teacherCtrl");
const areaCtrl = require('../controllers/areaCtrl');

/**
 * 获取老师列表
 * orderBy 顺序 grade 年级 district 区域
 * subject 科目 teacherType 老师类型  tags 老师特点
 */
router.get('/list/:orderBy/:grade/:district/:subject/:teacherType/:tags/:gender/:city/:offset', async(ctx, next) => {
  let { orderBy, grade, district, subject, teacherType, gender, tags, offset, city } =ctx.params;
  let paramsOld = { orderBy, grade, district, subject, teacherType, gender, tags, offset, city };
  if (tags != 'unlimit') {
    tags = tags.split("+");
  } else {
    tags = [];
  }
  offset = parseInt(offset);
  let params = { orderBy, grade, district, subject, teacherType, gender, tags, offset, city };
  let data = await teacherCtrl.listTeacher(params);
  data.params = paramsOld;
  data.renderType = "selectTeacher";
  console.log('/list/:orderBy/:grade/:district/:subject/:teacherType/:tags/:gender/:offset', data.list);
  return await ctx.render("selectTeacher", data)
});
/**
 * 通过老师ID 获取老师信息
 */
router.get('/:teacherID/:city', async(ctx, next) => {
  let { teacherID, city = dictionCtrl.defaultCity.a_id } =ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  assert(parseInt(teacherID), '参数不正确');
  teacherID = parseInt(teacherID);
  let data = await teacherCtrl.getTeacherInfo({ teacherID, cityId: city });
  data.params = { teacherID, city };
  console.log('/:teacherID   data.teacher=====', data.teacher);
  console.log('/:teacherID   data.latestComments=====', data.latestComments);

  data.renderType = "teacherDetail";
  return await ctx.render("teacherDetail", data)
});

/**
 * 获取老师评价
 */
router.get('/teacher/comments/:teacherId/:city', async(ctx, next) => {
  let { teacherId, city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city, teacherId };
  let data = await teacherCtrl.getTeacherCommentsByTeacherId({ teacherID: teacherId, cityId: city });
  data.params = params;
  console.log('/teacher/comments/:teacherId  data.comments====', data.comments);
  console.log('/teacher/comments/:teacherId  data.latestComments====', data.latestComments);
  console.log('/teacher/comments/:teacherId  data.headImg====', data.headImg);
  console.log('/teacher/comments/:teacherId  data.name====', data.name);
  data.renderType = "teacherEvaluate";
  return await ctx.render("teacherEvaluate", data)
});

module.exports = router;