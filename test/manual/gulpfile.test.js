const gulp = require('gulp');
const concat = require('gulp-concat');
var path = require('path');
const replace = require('gulp-replace');
const strip = require('gulp-strip-comments');

gulp.task('build', function(done) {
  gulp.src(path.join(__dirname, '../../lib/**/*.js'))
    .pipe(replace(/\/\* NOBROWSER_START \*\/[\s\S]*?\/\* NOBROWSER_END \*\//g, ' '))
    .pipe(replace(/function smartAvatar/g, 'export default function smartAvatar'))
    .pipe(strip())
    .pipe(replace(/var {?[\s\S]*}? = require\((.*)\);/g, ''))
    .pipe(replace(/module\.exports(.*)/g, ''))
    .pipe(concat('sa-test.js'))
    .pipe(gulp.dest(__dirname + '/js'))
  done();
});

gulp.task('default', gulp.parallel('build'));
