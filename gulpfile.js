const gulp = require('gulp');
const pump = require('pump');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const rename = require("gulp-rename");

// # HTML #
const htmlReplace = require('gulp-html-replace');

// # CSS #
const csslint = require('gulp-csslint');
const cssmin = require('gulp-cssmin');
const cleanCSS = require('gulp-clean-css');

// # JS #
const jshint = require('gulp-jshint'); 
const summary = require("jshint-summary") //reporter do jshint

const uglify = require('gulp-uglify');

// # Imagens #
const imagemin = require('gulp-imagemin');

// # Browser-sync #
const browserSync = require('browser-sync');

// # Plugin Escolhido #
const htmlmin = require('gulp-htmlmin');

// # SASS #
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps');

sassDevOptions = {
    outputStyle: 'expanded'
}
  
// Produção

var sassProdOptions = {
    outputStyle: 'compressed'
}

var config = {
    srcPath: 'src/',
    distPath: 'dist/',
    sassPath: 'src/sass/*.scss'
  };

gulp.task('default', ['copy'], function() {
    gulp.start('build-img', 'sass','merge-css', 'html-replace', 'html-minify', 'compress');
})

gulp.task('clean', function() {
    return gulp.src('dist')
               . pipe(clean() );
});

gulp.task('copy', ['clean'] ,  function() {
   return gulp.src('src/**/*')
              .pipe(gulp.dest('dist') );
});

gulp.task('build-img',  function() {
    gulp.src('src/img/**/*')
        .pipe(imagemin() )
        .pipe(gulp.dest('dist/img') );

});

gulp.task('merge-css', function() {
    gulp.src(['src/css/*.css'])
        .pipe(concat('styles.min.css') )
        .pipe(cleanCSS() ) // <--- Minificando CSS
        .pipe(gulp.dest('dist/css') );
 });

 gulp.task('html-replace', function() {
    gulp.src('src/*.html')
    .pipe(htmlReplace({css:'css/styles.min.css'}))
    .pipe(gulp.dest('dist'));
 });

 gulp.task('html-minify', function() {
    return gulp.src('dist/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
  });

 gulp.task('browser-sync', function() {
     browserSync.init({
         server: {
             baseDir: 'src'
         }
     });
     gulp.watch('src/**/*')
         .on('change',  browserSync.reload );        

 });
  
 /* monitorar erros em arquivos css */
gulp.task('css-observer', function() {
  gulp.src('src/css/*.css')
    .pipe(csslint() )
    .pipe(csslint.formatter() );
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('jshint', function() {
    return gulp.src('src/js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-summary', {
        verbose: true,
        reasonCol: 'cyan,bold'
    }));
});

// ********** SASS **********

gulp.task('sass-dev', function() {
    return gulp.src(config.sassPath)
      .pipe(sass(sassDevOptions).on('error', sass.logError))
      .pipe(gulp.dest(config.srcPath+'css'));
  });

gulp.task('sass-prod', function() {
    return gulp.src(config.sassPath)
      .pipe(sass(sassProdOptions).on('error', sass.logError))
      .pipe(rename('styles.min.css'))
      .pipe(gulp.dest(config.distPath+'css'));
});

gulp.task('watch-sass', ['sass-dev', 'sass-prod', 'browser-sync'], function() {
    gulp.watch(config.srcPath+'sass/**/*.scss', ['sass-dev', 'sass-prod']);
});