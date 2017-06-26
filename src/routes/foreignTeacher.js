/**
 * Created by Administrator on 2017/6/21.
 */
const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    return await ctx.render("foreignTeacher", {})
});

module.exports = router