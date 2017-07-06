/**
 * Created by Administrator on 2017/6/26.
 */
const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    let data= {}
    data.renderType = "teacherDetail"
    return await ctx.render("teacherDetail", data)
});

module.exports = router