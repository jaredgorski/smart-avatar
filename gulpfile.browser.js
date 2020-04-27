const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const strip = require('gulp-strip-comments');

gulp.task('build', function(done) {
  gulp.src(__dirname + '/lib/**/*.js')
    .pipe(replace(/\/\* NOBROWSER_START \*\/[\s\S]*?\/\* NOBROWSER_END \*\//g, ' '))
    .pipe(replace(/function smartAvatar/g, 'export default function smartAvatar'))
    .pipe(strip())
    .pipe(replace(/var {?[\s\S]*}? = require\((.*)\);/g, ''))
    .pipe(replace(/module\.exports(.*)/g, ''))
    .pipe(concat('index.browser.js'))
    .pipe(gulp.dest(__dirname + '/dist/'))
  done();
});

gulp.task('default', gulp.parallel('build'));

