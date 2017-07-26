/**
 * Created by Administrator on 2017/6/21.
 */
const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');

router.get('/:city', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.params = { city };
  return await ctx.render("mobile/foreignTeacher", data)
});

module.exports = router;