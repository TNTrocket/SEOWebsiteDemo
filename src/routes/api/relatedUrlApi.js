/**
 * 友情链接增删查改
 * Created by tseian on 07/08/2017.
 */

const router = require('koa-router')();
const relatedUrlCtrl = require('../../controllers/relatedUrlCtrl');
const assert = require('assert');
/**
 * 获取所有url
 */
router.get('/list', async(ctx, next) => {
  let { status } = ctx.params;
  return ctx.response.body = await relatedUrlCtrl.list(status);
});

/**
 * 删除一个url
 */
router.get('/del/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(id, 'id 参数不正确');
  assert(parseInt(id), 'id 参数不正确');
  id = parseInt(id);

  return ctx.response.body = await relatedUrlCtrl.del(id);
});

/**
 * 增加一个url
 */
router.post('/add', async(ctx, next) => {
  let { name, url } = ctx.request.body;
  assert(name, 'name 参数有误');
  assert(url, 'url 参数有误');
  let createBy = 0;
  return ctx.response.body = await relatedUrlCtrl.add(name, url, createBy);
});


module.exports = router;
