const router = require('koa-router')();
router.get('/', async(ctx, next) => {
  return await ctx.render("index", {
    user: {
      name: "tnt"
    }
  });
});
router.get('/test', async(ctx, next) => {
  return await ctx.render("information")
});

module.exports = router;
