/**
 * Created by tseian on 17/06/2017.
 */

const router = require('koa-router')();
const assert = require('assert');
const articleCtrl = require('../controllers/articleCtrl');

/**
 * 删除文章
 */
router.del('/del/:id', async(ctx, next) => {
  let { id } = ctx.params;
  id = parseInt(id);
  assert(id && typeof id == 'number', '参数id不正确');
  await articleCtrl.del(id, ctx, next);
});

router.post('/list', async(ctx, next) => {
  let { title, id, offset } = ctx.request.body;
  let data = await articleCtrl.getlist(title, id, offset);
  ctx.response.body = data;
  next();
});

/**
 * 保存修改后的文章
 */
router.post('/update', async(ctx, next) => {
  let { id, title, imageUrl, content, time, seoTitle, enuCode1, enuCode2, enuCode3, description, keyword } = ctx.request.body;

  assert(id && parseInt(id), '参数ID不正确');
  assert(title, '参数title不能为空');
  // assert(imageUrl, '参数imageUrl不能为空');
  assert(content, '参数content不能为空');
  assert(seoTitle, '参数seoTitle不能为空');
  // assert(enuCode1, '参数enuCode1不能为空');
  // assert(enuCode2, '参数enuCode2不能为空');
  assert(description, '参数description不能为空');
  assert(keyword, '参数keyword不能为空');

  id = parseInt(id);

  let params = { id, title, imageUrl, content, time, seoTitle, enuCode1, enuCode2, enuCode3, description, keyword };



  let data = await articleCtrl.updateArticle(params);
  console.log('router.post(/update/:id', data);

  ctx.response.body = data;

  next();
});


/**
 * 获取需要修改的文章
 */
router.get('/article/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(parseInt(id), '文章ID参数有误');
  let data = await articleCtrl.getArticleById(id);
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  console.log('router.get(/:id--data====', data);
  ctx.response.body = data;
  next();
});

router.get('/diction', async(ctx, next) => {
  ctx.response.body = await articleCtrl.diction();
  next();
});

router.get('/update/status/:id/:status', async(ctx, next) => {
  let { id, status } =ctx.params;
  assert(id && parseInt(id), '参数ID不正确');
  assert(parseInt(status) <= 2 && parseInt(status) >= 0, '参数status不正确');
  let data = await articleCtrl.changeEditStatus(id, status);
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  ctx.response.body = data;
  next();
});

module.exports = router;
