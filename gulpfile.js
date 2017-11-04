var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    gcmq = require('gulp-group-css-media-queries');

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.+(scss|sass)')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(gcmq())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

/*
gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});
*/

gulp.task('common-uglify', function() {
  return gulp.src('app/js/common.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', [/*'scripts', 'common-uglify', */'browser-sync'], function() {
  gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch('app/js/**/*.js', ['common-uglify'], browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/css/**/*.css', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass'/*, 'scripts'*/], function() {
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/main.min.css',
    'app/css/normalize.min.css',
    'app/css/libs.min.css'
  ])
  .pipe(gulp.dest('dist/css'));
  
  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
  
  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));
  
  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

});