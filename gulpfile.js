let gulp = require('gulp')
let browserify = require('gulp-browserify')
let babel = require('gulp-babel')
let nodemon = require('gulp-nodemon')
let runSequence = require('run-sequence')
let del = require("del")
let less = require('gulp-less')
let path = require('path')
let postcss = require('gulp-postcss')
let px2rem = require('postcss-px2rem')
let autoprefixer = require('autoprefixer')
let uglify = require("gulp-uglify")
let pump = require("pump")
// let sourcemap = require("gulp-sourcemaps")
// let pro = process.env.NODE_ENV
// console.log('process=====',process)

gulp.task('mobile:less', (cb) => {
  let processors = [px2rem({ remUnit: 100 }), autoprefixer()];
  gulp.src('./public/mobile/css/style.less')
    .pipe(less())
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/build')).on('end', cb);
})

gulp.task('pc:less', (cb) => {
  let processors = [autoprefixer()];
  gulp.src('./public/pc/css/pc.less')
    .pipe(less())
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/build/')).on('end', cb);
})
gulp.task('less', (callback) => {
  runSequence(
    "mobile:less",
    "pc:less",
    callback);
})
gulp.task('watch:less', (cb) => {
  gulp.watch('./public/**/*.less', ['less']).on('end', cb)
})
gulp.task('watch:js', (cb) => {
    gulp.watch('./public/module/**/*.js', ['scripts:mobile']).on('end', cb)
})

gulp.task('compress:mobile', (cb) => {
  pump([
      gulp.src('./public/build/main.js'),
      uglify(),
      gulp.dest('./public/build')
    ],
    cb)
})
gulp.task('compress:pc', (cb) => {
  pump([
      gulp.src('./public/build/pcMain.js'),
      uglify(),
      gulp.dest('./public/build')
    ],
    cb)
})

gulp.task('babel:mobile', (cb) => {
  gulp.src(['public/mobile/module/*.js', 'public/mobile/module/**/*.js'])
    // .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(sourcemap.write('../build'))
    .pipe(gulp.dest('./public/mobile/temp/')).on('end', cb)
})
gulp.task('countRem', (cb) => {
    gulp.src('./public/mobile/temp/countRem.js')
        .pipe(gulp.dest('./public/build/')).on('end', cb)
})
gulp.task('browserify:mobile', (cb) => {
    gulp.src('./public/mobile/temp/main.js')
        .pipe(browserify({
          insertGlobals: true
        }))
        .pipe(gulp.dest('./public/build/')).on('end', cb)
})
gulp.task('scripts:mobile',(cb) => {
    runSequence('babel:mobile','browserify:mobile','countRem','temp-clean',cb);
})
gulp.task("node:sever", ['scripts:mobile', 'less', 'scripts:pc'], () => {
  nodemon({
    script: './src/app.js',
    ignore: ['.idea', 'node_modules', 'public/build','public/mobile/temp','public/pc/temp'],
    tasks: ['scripts:mobile','scripts:pc'],
    env: { 'NODE_ENV': process.env.NODE_ENV }
  })
})
gulp.task("build-clean", () => {
  return del("./public/build")
})
gulp.task("temp-clean", () => {
    return del("./public/mobile/temp")
})

//pc端打包
gulp.task("temp-clean:pc", () => {
  return del("./public/pc/temp")
})
gulp.task("scripts:pc",(cb)=>{
  runSequence('babel:pc','browserify:pc','temp-clean:pc',cb);
})
gulp.task("babel:pc",(cb)=>{
  gulp.src(['public/pc/module/*.js', 'public/pc/module/**/*.js'])
  // .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(sourcemap.write('../build'))
    .pipe(gulp.dest('./public/pc/temp/')).on('end', cb)
})
gulp.task("browserify:pc",(cb)=>{
  gulp.src('./public/pc/temp/pcMain.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(gulp.dest('./public/build/')).on('end', cb)
})




gulp.task('dev', (callback) => {
  runSequence(
    "build-clean",
    "node:sever",
    "watch:less",
    callback);
});
gulp.task('build', (callback) => {
    runSequence(
        "build-clean",
        "scripts:mobile",
        "scripts:pc",
        "less",
        "compress:mobile",
        "compress:pc",
        callback);
});