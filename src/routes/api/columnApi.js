/**
 * 主要对栏目页面的tkd修改
 * Created by tseian on 11/08/2017.
 */

const router = require('koa-router')();
const assert = require('assert');
const columnCtrl = require('../../controllers/columnCtrl');
/**
 * 修改首页栏目下面的tkd
 */
router.post('/tkd/index/update', async(ctx, next) => {
  let { title, keywords, description } = ctx.request.body;
  return ctx.response.body = await columnCtrl.updateIndexTkd({ title, keywords, description });
});

module.exports = router;