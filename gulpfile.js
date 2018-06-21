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

// # SASS #
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps');

var config = {
    srcPath: 'src/',
    distPath: 'dist/'
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
        .pipe(concat('styles.css') )
        .pipe(cleanCSS() ) // <--- Minificando CSS
        .pipe(gulp.dest('dist/css') );
 });

 gulp.task('html-replace', function() {
    gulp.src('src/*.html')
    .pipe(htmlReplace({css:'css/styles.css'}))
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

gulp.task('sass', function(){
    //a marcação define que iremos pegar todos os arquivos SCSS e Sass da pasta src/sass, inclusive subpastas e seu conteúdo se houverem
    return gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
      .pipe(sourcemaps.init()) //iniciamos o sourcemap para gravar o MAP para debuging
      .pipe(sass({ //iniciamos o modulo do Sass
        outputStyle: 'compressed' //adicionamos a opção para que o produto final seja comprimido/minificado
      }).on('error', sass.logError)) // Se der erro exibirá um log e criará um arquivo para análise
      .pipe(sourcemaps.write('./')) //Escrevera o sourcemap na mesma pasta ou subpasta do CSS gerado
      .pipe(gulp.dest(config.distPath+'css')) //Irá salvar o arquivo na estrutura equivalente dentro da pasta /dist/css
      .pipe(browserSync.reload({ //ativa o reload da pagina quando terminar de fazer o Sync
        stream: true // (se o servidor estiver iniciado ele dá o reload)
      }));
  });