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
const error = require('koa-json-error');
const jwt = require('koa-jwt');

const index = require("./routes/index");
const information = require("./routes/information");
const foreignTeacher = require("./routes/foreignTeacher");
const appDownload = require("./routes/appDownload");
const successCase = require("./routes/successCase");
const contactUS = require("./routes/contactUS");
const joinUS = require("./routes/joinUS");
const aboutUS = require("./routes/aboutUS");
const teacherDetail = require("./routes/teacherDetail");
const selectTeacher = require("./routes/selectTeacher");
const article = require("./routes/articleRoute");
const teacher = require("./routes/teacherRoute");


app.name = config.app.name;
app.env = config.app.env;
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(json());
app.use(cors());
app.use(error(function formatError(err) {
  return {
    status: err.status,
    message: err.message,
    success: false,
    reason: 'Unexpected'
  }
}));


ejs(app, {
  root: path.join(__dirname, '../public/views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});


router.use('/user', index.routes(), index.allowedMethods());
router.use('/information', information.routes(), information.allowedMethods());
router.use('/foreignTeacher', foreignTeacher.routes(), foreignTeacher.allowedMethods());
router.use('/appDownload', appDownload.routes(), appDownload.allowedMethods());
router.use('/successCase', successCase.routes(), successCase.allowedMethods());
router.use('/contactUS', contactUS.routes(), contactUS.allowedMethods());
router.use('/joinUS', joinUS.routes(), joinUS.allowedMethods());
router.use('/aboutUS', aboutUS.routes(), aboutUS.allowedMethods());
router.use('/selectTeacher', selectTeacher.routes(), selectTeacher.allowedMethods());
router.use('/article', article.routes(), router.allowedMethods());
router.use('/teacher', teacher.routes(), router.allowedMethods());
router.use('/teacherDetail', teacherDetail.routes(), router.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());


// app.use(function(ctx, next) {
//   if (!ctx.url.match(/^\/api/)) {
//     ctx.body = 'unprotected\n';
//   } else {
//     return next();
//   }
// });
//
// app.use(jwt({ secret: 'shared-secret' }));
//
// app.use(function(ctx) {
//   if (ctx.url.match(/^\/api/)) {
//     ctx.body = 'protected\n';
//     // ctx.response.header.
//     console.log('ctx====', ctx);
//   }
// });


app.listen(config.app.port);




