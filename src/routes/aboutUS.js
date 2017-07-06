const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    let data= {}
    data.renderType = "aboutUS"
    return await ctx.render("aboutUS", data)
});

module.exports = router
