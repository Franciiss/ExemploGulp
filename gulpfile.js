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
var htmlmin = require('gulp-htmlmin');

gulp.task('default', ['copy'], function() {
    gulp.start('build-img', 'merge-css', 'compress', 'html-minify', 'html-replace',  );
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
    gulp.src('dist/img/**/*')
        .pipe(imagemin() )
        .pipe(gulp.dest('dist/img') );

});

gulp.task('merge-css', function() {
    gulp.src(['dist/css/Bold-BS4-Animated-Back-To-Top.css',
              'dist/css/styles.css',
              'dist/css/Parallax-Scroll-Effect.css',
            ])
        .pipe(concat('styles.css') )
        .pipe(cleanCSS() ) // <--- Minificando CSS
        .pipe(gulp.dest('dist/css') );
 });

 gulp.task('html-replace', function() {
    gulp.src('src/**/*.html')
    .pipe(htmlReplace({css:'css/styles.css'}) )
    .pipe(gulp.dest('dist') );
 });

 gulp.task('html-minify', function() {
    return gulp.src('src/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist/'));
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
  
 //     gulp.watch('src/**/*')
 //     .on('change',  function() {
 //       browserSync.reload();
 //      });        

 
 /* monitorar erros em arquivos css */
gulp.task('css-observer', function() {
  gulp.src('src/css/*.css')
    .pipe(csslint() )
    .pipe(csslint.formatter() );
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/*.js'),
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
