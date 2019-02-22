var concat = require('gulp-concat');
var gulp = require('gulp');
var path = require('path');
var replace = require('gulp-replace');

gulp.task('build', function(done) {
  gulp.src(path.join(__dirname, '../../lib/**/*.js'))
    .pipe(replace(/function smartAvatar/g, 'export default function smartAvatar'))
    .pipe(replace(/module\.exports(.*)/g, ''))
    .pipe(replace(/var {?[\s\S]*}? = require\((.*)\);/g, ''))
    .pipe(concat('sa-test.js'))
    .pipe(gulp.dest(__dirname + '/js'))
  done();
});

gulp.task('default', gulp.parallel('build'));