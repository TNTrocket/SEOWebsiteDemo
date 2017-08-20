/**
 * Created by tseian on 17/06/2017.
 */

const router = require('koa-router')();
const assert = require('assert');
const articleCtrl = require('../../controllers/articleCtrl');
const teacherCtrl = require('../../controllers/teacherCtrl');

/**
 * 删除文章
 */
router.del('/del/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(id && parseInt(id), '参数id不正确');
  id = parseInt(id);
  return ctx.response.body = await articleCtrl.del(id, ctx, next);
});
/**
 * 文章列表 未编辑
 */
router.post('/list/row', async(ctx, next) => {
  let { title, id, offset } = ctx.request.body;
  let data = await articleCtrl.getlist(title, id, offset, 0);
  return ctx.response.body = data;
});


/**
 * 文章列表 已编辑
 */
router.post('/list/edited', async(ctx, next) => {
  let { title, id, offset } = ctx.request.body;
  let data = await articleCtrl.getlist(title, id, offset, 1);
  return ctx.response.body = data;
});

/**
 * 文章列表 全部
 */
router.post('/list/all', async(ctx, next) => {
  let { title, id, offset } = ctx.request.body;
  let data = await articleCtrl.getlist(title, id, offset);
  return ctx.response.body = data;
});

/**
 * 保存修改后的文章
 */
router.post('/update', async(ctx, next) => {
  let { id, title, imageUrl, content, time, seoTitle, description, keyword, articleTypeId } = ctx.request.body;

  assert(id && parseInt(id), '参数ID 不正确');
  assert(title, '参数title 不能为空');
  assert(content, '参数content 不能为空');
  assert(seoTitle, '参数seoTitle 不能为空');
  assert(description, '参数description 不能为空');
  assert(keyword, '参数keyword 不能为空');
  assert(articleTypeId && parseInt(articleTypeId), '参数type 不正确');
  time = parseInt(time);
  id = parseInt(id);

  let params = {
    id,
    title,
    imageUrl,
    content,
    time,
    seoTitle,
    description,
    keyword,
    articleTypeId
  };

  let data = await articleCtrl.updateArticle(params);

  return ctx.response.body = data;
});


/**
 * 获取需要修改的文章
 */
router.get('/detail/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(parseInt(id), '文章ID参数有误');
  let data = await articleCtrl.getArticleById(id);

  // console.log('router.get(/:id--data====', data);
  console.log('/detail/:id');
  return ctx.response.body = data;
});

router.get('/diction', async(ctx, next) => {
  return ctx.response.body = await articleCtrl.diction();
});

router.get('/update/status/:id/:status', async(ctx, next) => {
  let { id, status } = ctx.params;
  assert(id && parseInt(id), '参数ID不正确');
  assert(parseInt(status) <= 2 && parseInt(status) >= 0, '参数status不正确');
  let data = await articleCtrl.changeEditStatus(id, status);
  return ctx.response.body = data;
});

/**
 * 发布一个文章
 */
router.post('/add', async(ctx, next) => {
  let { title, articleTypeId, content, seoKeywords, seoDescription, createTime = new Date() } = ctx.request.body;
  assert(title, 'title 不能为空');
  assert(articleTypeId, 'articleTypeId 不能为空');
  assert(content, 'content 不能为空');
  assert(content, 'content 不能为空');
  assert(seoKeywords, 'seoKeywords 不能为空');
  assert(seoDescription, 'seoDescription 不能为空');
  assert(parseInt(articleTypeId), 'articleTypeId 参数不正确');
  articleTypeId = parseInt(articleTypeId);
  return ctx.response.body = await articleCtrl.add({
    title,
    articleTypeId,
    content,
    seoKeywords,
    seoDescription,
    createTime
  });
});


/**
 * 增加一个无忧资讯的类型
 */
router.post('/wuyou/type/add', async(ctx, next) => {
  let { name, seoUrl, seoTitle, keywords, description } = ctx.request.body;
  assert(seoTitle, 'seoTitle 不能为空');
  assert(keywords, 'keywords 不能为空');
  assert(seoUrl, 'seoUrl 不能为空');
  assert(description, 'description 不能为空');

  return ctx.response.body = await articleCtrl.addWuyouType({ name, seoUrl, seoTitle, keywords, description });
});

/**
 * 上架一个无忧资讯了栏目
 */
router.post('/wuyou/type/up/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(id && parseInt(id), 'id 参数不正确');
  let status = 1;
  return ctx.response.body = await articleCtrl.updateArticleTypeStatus(id, status);
});
/**
 * 下架一个无忧资讯了栏目
 */
router.get('/wuyou/type/del/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(id && parseInt(id), 'id 参数不正确');
  return ctx.response.body = await articleCtrl.delArticleTypeById(id);
});

/**
 * 修改一个无忧资讯文章类型
 */
router.post('/wuyou/type/update/:id', async(ctx, next) => {
  let { name, seoUrl, seoTitle, keywords, description } = ctx.request.body;
  let { id } = ctx.params;
  assert(id && parseInt(id), 'name 不能为空');
  assert(name, 'name 不能为空');
  assert(seoTitle, 'seoTitle 不能为空');
  assert(keywords, 'keywords 不能为空');
  assert(seoUrl, 'seoUrl 不能为空');
  assert(description, 'description 不能为空');
  id = parseInt(id);
  return ctx.response.body = await articleCtrl.updateArticleType({ id, name, seoUrl, seoTitle, keywords, description });
});

/**
 * 无忧资讯文章类型清单
 */
router.get('/wuyou/type/list/all', async(ctx, next) => {
  return ctx.response.body = await articleCtrl.wuyouTypeList();
});

/**
 * 下一篇文章详情
 */
router.get('/next/:id', async(ctx, next) => {
  let { id } = ctx.params;
  assert(id && parseInt(id), 'id参数不正确');
  return ctx.response.body = await articleCtrl.nextArticle(id);
});


module.exports = router;