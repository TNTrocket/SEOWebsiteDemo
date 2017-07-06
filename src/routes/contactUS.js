/**
 * Created by Administrator on 2017/6/26.
 */
const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    let data= {}
    data.renderType = "contactUS"
    return await ctx.render("contactUS", data)
});

module.exports = router