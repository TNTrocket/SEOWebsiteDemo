const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');


router.get('/:city', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.params = { city };
  data.renderType = "aboutUS";
  return await ctx.render("mobile/aboutUS", data)
});

module.exports = router;
