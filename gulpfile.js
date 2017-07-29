const gulp = require('gulp');
const gutil = require('gulp-util');
const less = require('gulp-less');
const watch = require('gulp-watch');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
const path = require('path');

gulp.task('css', ['clean'], function() {
  const onError = function (err) {
    gutil.log(gutil.colors.red("ERROR", 'css'), err.message);
    this.emit("end", new gutil.PluginError('css', err, { showStack: false }));
  };

  return gulp.src([
    './views/*.less',
    '!./views/mixins/*',
    '!./views/typography.less'
  ]).pipe(less(
      {paths: [path.join(__dirname, 'views', 'page')]}
    ).on('error', onError))
    .pipe(cleanCSS({
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(gulp.dest('./build'))
});

gulp.task('watch', function() {
  gulp.watch('./views/*.@(less|css)', ['css']);
});

gulp.task('clean', function() {
  return gulp.src(['./build','./logs/*'], {read:false})
    .pipe(clean())
});

gulp.task('default', ['css']);
