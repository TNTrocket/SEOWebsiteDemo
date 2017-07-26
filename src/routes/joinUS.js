const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');

router.get('/:city', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  data.params = { city };
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.renderType = "joinUS";
  return await ctx.render("mobile/joinUS", data)
});

module.exports = router;
