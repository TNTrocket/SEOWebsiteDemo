const Koa = require("koa");
const app = new Koa();

const router = require("koa-router")();
const ejs = require("koa-ejs");
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const path = require("path");
const serve = require('koa-static');
const config = require("./config/config");
const error = require('koa-json-error');
require('../src/config/sequelize');
require('../src/models/articleModel');

app.name = config.app.name;
app.env = config.app.env;
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(json());

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


const index = require("./routes/index");
const information = require("./routes/information");
const foreignTeacher = require("./routes/foreignTeacher");
const article = require("./routes/articleRoute");

router.use('/user', index.routes(), index.allowedMethods());
router.use('/information', information.routes(), information.allowedMethods());
router.use('/foreignTeacher', foreignTeacher.routes(), foreignTeacher.allowedMethods());
router.use('/article', article.routes(), router.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());



app.listen(config.app.port);




