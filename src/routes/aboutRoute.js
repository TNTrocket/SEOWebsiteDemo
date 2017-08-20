/**
 * Created by tseian on 26/07/2017.
 */

const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');
const isMobile = require("./../common/checkUA");

router.get('/:city/about/contact.html', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  data.params = { city };
  data.tkd = {
    title: '联系我们_选师无忧',
    keywords: '',
    description: '广州岗顶总部 地址:  广州市天河区五山路华晟大厦1506室咨询热线:  020-8753298'
  };
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.renderType = "contactUS";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/contactUS", data);
  } else {
    return await ctx.render("pc/contactUS", data);
  }
});

router.get('/:city/about/us.html', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.params = { city };
  data.tkd = {
    title: '联系我们_选师无忧',
    keywords: '',
    description: '广州岗顶总部 地址:  广州市天河区五山路华晟大厦1506室咨询热线:  020-8753298'
  };
  data.renderType = "aboutUS";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/aboutUS", data);
  } else {
    return await ctx.render("pc/aboutUS", data);
  }
});


router.get('/:city/about/app.html', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.params = { city };
  data.tkd = {
    title: '家长APP下载_家教辅导APP免费下载',
    keywords: '家长APP下载,家教辅导APP免费下载',
    description: '选师无忧APP,专业一对一家教app,14年中小学家教辅导经验,通过大数据帮助老师和学生精准对接，有效提高孩子学习成绩'
  };
  data.renderType = "appDownload";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/appDownload", data);
  } else {
    return await ctx.render("pc/appDownload", data);
  }
});

router.get('/:city/about/join.html', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  data.tkd = {
    title: '加入我们_选师无忧',
    keywords: '',
    description: '加入我们 hr@51xuanshi.com'
  };
  data.params = { city };
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.renderType = "joinUS";
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/joinUS", data);
  } else {
    return await ctx.render("pc/joinUS", data);
  }
});

router.get('/:city/about/beComeTeacher.html', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.params = { city };
  data.tkd = {
    title: '联系我们_选师无忧',
    keywords: '',
    description: '广州岗顶总部 地址:  广州市天河区五山路华晟大厦1506室咨询热线:  020-8753298'
  };
  data.renderType = "beComeTeacher";

  return await ctx.render("pc/beComeTeacher", data);

});

module.exports = router;