const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    let data= {}
    data.renderType = "joinUS"
    return await ctx.render("joinUS", data)
});

module.exports = router
