/**
 * Created by Administrator on 2017/6/21.
 */
const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');
const areaCtrl = require('../controllers/areaCtrl');

router.get('/:city/english/', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.tkd = {
    title: '【选师无忧】英语学习辅导_英语学习一对一辅导_英语家教辅导',
    keywords: '英语学习辅导,英语学习一对一辅导,英语家教辅导',
    description: '外教1对1家教辅导,边学边用,更快更扎实掌握口语,采取独特的英语口语和听力培训方式,全面提升你孩子的英语'
  };
  data.params = { city };
  return await ctx.render("mobile/foreignTeacher", data)
});

module.exports = router;