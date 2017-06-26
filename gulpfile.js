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



gulp.task('mobile:less', (cb) => {
  let processors = [px2rem({ remUnit: 100 }), autoprefixer()];
  gulp.src('./public/css/mobile/style.less')
    .pipe(less())
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/build/')).on('end', cb);
})
gulp.task('pc:less', (cb) => {
  let processors = [autoprefixer()];
  gulp.src('./public/css/pc/pc.less')
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
  gulp.watch('./public/css/**/*.less', ['less']).on('end', cb)
})
gulp.task('watch:js', (cb) => {
    gulp.watch('./public/module/**/*.js', ['scripts']).on('end', cb)
})

gulp.task('compress:js', (cb) => {
  pump([
      gulp.src('./public/build/main.js'),
      uglify(),
      gulp.dest('./public/build')
    ],
    cb)
})

gulp.task('babel', (cb) => {
  gulp.src(['public/module/*.js', 'public/module/**/*.js'])
    // .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(sourcemap.write('../build'))
    .pipe(gulp.dest('./public/temp/')).on('end', cb)
})
gulp.task('browserify', (cb) => {
    gulp.src('./public/temp//main.js')
        .pipe(browserify({
          insertGlobals: true
        }))
        .pipe(gulp.dest('./public/build/')).on('end', cb)
})
gulp.task('scripts',(cb) => {
    runSequence('babel','browserify','temp-clean',cb);
})
gulp.task("node:sever", ['scripts', 'less'], () => {
  nodemon({
    script: './src/app.js',
    ignore: ['.idea', 'node_modules', 'build','src','temp'],
    tasks: ['scripts'],
    env: { 'NODE_ENV': 'development' }
  })
})
gulp.task("build-clean", () => {
  return del("./public/build")
})
gulp.task("temp-clean", () => {
    return del("./public/temp")
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
        "scripts",
        "less",
        "compress:js",
        callback);
});