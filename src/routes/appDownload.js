/**
 * Created by Administrator on 2017/6/26.
 */
const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    return await ctx.render("appDownload", {})
});

module.exports = router