var gulp = require('gulp')
var less = require('gulp-less')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')

gulp.task('less', function () {
  return gulp.src('./app.less')
    .pipe(plumber())  
    .pipe(less())
    .pipe(rename((path) => path.extname = '.wxss'))
    .pipe(gulp.dest('./'));
});
gulp.watch('./app.less', ['less']);
