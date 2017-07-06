const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    let data= {}
    data.renderType = "selectTeacher"
    return await ctx.render("selectTeacher", data)
});

module.exports = router
