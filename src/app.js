const Koa = require("koa");
const app = new Koa();
const cors = require('koa-cors');
const router = require("koa-router")();
const ejs = require("koa-ejs");
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const path = require("path");
const serve = require('koa-static');
const config = require("./config/config");
const jwt = require('koa-jwt');
const proxy = require('koa-proxy');


const index = require("./routes/indexRoute");
const information = require("./routes/informationRoute");
const foreignTeacher = require("./routes/foreignTeacherRoute");
const successCase = require("./routes/successCaseRoute");
const about = require("./routes/aboutRoute");
const teacher = require("./routes/teacherRoute");

const articleApi = require("./routes/api/articleApi");
const areaApi = require("./routes/api/areaApi");
const dictionaryApi = require("./routes/api/dictionaryApi");
const columnApi = require("./routes/api/columnApi");
const relateUrlApi = require("./routes/api/relatedUrlApi");

const initSys = require("./common/initSys");
initSys.init();

app.name = config.app.name;
app.env = config.app.env;
app.poxyHost = config.app.poxyHost;
app.viewCache = config.app.viewCache;
app.use(serve(path.join(__dirname, '../public')));
app.use(serve(path.join(__dirname, '../static')));
app.use(bodyparser());
app.use(json());
app.use(cors());



ejs(app, {
  root: path.join(__dirname, '../public/views'),
  layout: false,
  viewExt: 'html',
  cache: app.viewCache,
  debug: true
});
//添加代理
app.use(proxy({
  host: app.poxyHost,
  match: /^\/api\//
}));

// router.all('', async(ctx, next) => {
//   ctx.redirect('/');
//   ctx.status = 302;
// });


router.use('', index.routes(), index.allowedMethods());
router.use('', information.routes(), information.allowedMethods());
router.use('', foreignTeacher.routes(), foreignTeacher.allowedMethods());
router.use('', successCase.routes(), successCase.allowedMethods());
router.use('', teacher.routes(), router.allowedMethods());
router.use('', about.routes(), about.allowedMethods());

router.use('/article', articleApi.routes(), router.allowedMethods());
router.use('/area', areaApi.routes(), router.allowedMethods());
router.use('/diction', dictionaryApi.routes(), router.allowedMethods());
router.use('/column', columnApi.routes(), columnApi.allowedMethods());
router.use('/related/url', relateUrlApi.routes(), relateUrlApi.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

app.use((ctx, next) => {
  if (ctx.status == '404') {
    return ctx.redirect('/Guangzhou/');
  }
});

app.listen(config.app.port);

console.log('127.0.0.1:' + config.app.port);