/**
 * Created by tseian on 26/06/2017.
 */

const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const informationList = dictionCtrl.informationList;
const assert = require('assert');
const teacherCtrl = require("../controllers/teacherCtrl");
const areaCtrl = require('../controllers/areaCtrl');
const isMobile = require("./../common/checkUA");

/**
 * 获取老师列表
 */
router.get('/teachers/:cityPinyin/:queryString/', async(ctx, next) => {

  let { cityPinyin, queryString = 's-' } = ctx.params;
  let paramsOld = { city: cityPinyin, queryString };
  queryString = queryString.substr(2, queryString.length - 2);
  let params = { cityPinyin, queryString };
  let data = await teacherCtrl.listTeacher(params);
  data.params = paramsOld;

  data.renderType = "selectTeacher";
  // console.log('/list/:orderBy/:grade/:district/:subject/:teacherType/:tags/:gender/:offset', data.list);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/selectTeacher", data);
  } else {
    return await ctx.render("pc/selectTeacher", data);
  }
});


/**
 * 获取老师列表，分页路由
 */
router.get('/teachers/:cityPinyin/:queryString/:page/', async(ctx, next) => {

  let { cityPinyin, page = 'p2', queryString = 's-' } = ctx.params;
  let paramsOld = { page, city: cityPinyin, queryString };
  queryString = queryString.substr(2, queryString.length - 2);
  page = page.substring(1, page.length);
  let offset = 0;
  if (parseInt(page)) {
    offset = (parseInt(page) - 1) * 10;
  }

  let params = { page, cityPinyin, queryString, offset };

  let data = await teacherCtrl.listTeacher(params);
  data.params = paramsOld;
  data.renderType = "selectTeacher";
  // console.log('/list/:orderBy/:grade/:district/:subject/:teacherType/:tags/:gender/:offset', data.list);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/selectTeacher", data);
  } else {
    return await ctx.render("pc/selectTeacher", data);
  }
});

/**
 * 通过老师ID 获取老师信息
 */
router.get('/teacher/:teacherID', async(ctx, next) => {
  let { teacherID } = ctx.params;
  let cityPinyin = ctx.cookies.get('cityPinyin') || dictionCtrl.defaultCity.a_pinyin;

  teacherID = teacherID.substr(2, teacherID.length - 7);

  assert(parseInt(teacherID), '参数不正确');
  teacherID = parseInt(teacherID);
  let data = await teacherCtrl.getTeacherInfo({ teacherID, cityPinyin });
  data.params = { teacherID, city: cityPinyin };
  console.log("data=======",data);
  data.renderType = "teacherDetail";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/teacherDetail", data);
  } else {
    return await ctx.render("pc/teacherDetail", data);
  }
});

/**
 * 获取老师评价
 */
router.get('/teacher/:teacherId/dianping.html', async(ctx, next) => {
  let { teacherId } = ctx.params;
  let cityPinyin = ctx.cookies.get('cityPinyin') || dictionCtrl.defaultCity.a_pinyin;
  let params = { city: cityPinyin, teacherId };
  let data = await teacherCtrl.getTeacherCommentsByTeacherId({ teacherID: teacherId, cityPinyin: cityPinyin });
  data.params = params;
  // console.log('/teacher/comments/:teacherId  data.comments====', data.comments);
  // console.log('/teacher/comments/:teacherId  data.latestComments====', data.latestComments);
  // console.log('/teacher/comments/:teacherId  data.headImg====', data.headImg);
  // console.log('/teacher/comments/:teacherId  data.name====', data.name);
  data.renderType = "teacherEvaluate";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/teacherEvaluate", data);
  } else {
    return await ctx.render("pc/teacherComments", data);
  }
});

module.exports = router;