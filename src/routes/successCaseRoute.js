/**
 * Created by Administrator on 2017/6/26.
 */
const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');
const isMobile = require("./../common/checkUA");

router.get('/:city/case/', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.tkd = {
    title: '【选师无忧】最新小升初/初中/高中辅导提分案例_中小学个性化辅导提分专家',
    keywords: '',
    description: '14年中小学家教辅导经验,通过大数据帮助老师和学生精准对接,95%学员辅导一个月后成绩显著提升，看家长们说 在家就能试听课程， 试听满意再付费，全程班主任保障服务'
  };
  data.params = { city };

  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/successCase", data);
  } else {
    return await ctx.render("pc/successCase", data);
  }
});

module.exports = router;