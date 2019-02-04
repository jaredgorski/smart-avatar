var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');

gulp.task('build', function(done) {
  gulp.src(__dirname + '/lib/**/*.js')
    .pipe(replace(/function smartAvatar/g, 'export default function smartAvatar'))
    .pipe(replace(/module\.exports(.*)/g, ''))
    .pipe(replace(/var {?[\s\S]*}? = require\((.*)\);/g, ''))
    .pipe(concat('sa-demo.js'))
    .pipe(gulp.dest(__dirname + '/demo/js'))
  done();
});

gulp.task('default', gulp.parallel('build'));