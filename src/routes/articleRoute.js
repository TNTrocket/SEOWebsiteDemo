/**
 * Created by tseian on 17/06/2017.
 */

const router = require('koa-router')();
const assert = require('assert');
const articleCtrl = require('../controllers/articleCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');

router.del('/del/:id', async(ctx, next) => {
  let { id } = ctx.params;
  id = parseInt(id);

  assert(id && typeof id == 'number', '参数id不正确');
  await articleCtrl.del(id, ctx, next);
});

/**
 * type 类型
 */
router.post('/carefree/list', async(ctx, next) => {
  let { type, offset = 0, limit = 8 } =ctx.params;


  let params = { type, offset, limit };
  await articleCtrl.list(params, ctx, next);
});



module.exports = router;
