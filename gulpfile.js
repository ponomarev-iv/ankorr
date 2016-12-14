/**
 * Created by ponomarev-iv on 14.12.2016.
 */
'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    spritesmith  = require('gulp.spritesmith'),
    pngquant = require('imagemin-pngquant'),
    newer = require('gulp-newer'),
    size = require('gulp-size'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        css: 'public/css/',
        img: 'public/img/',
        js: 'public/js/',
        base: '',
        html: 'public/'
    },
    src: {
        style: '_dev/scss/all.scss',
        scss: '_dev/scss/',
        img: '_dev/img/*.*',
        sprite: '_dev/img/sprite/*.png',
        spriteRetina: '_dev/img/sprite@2x/*.png',
        js: '_dev/js/*.js',
        html: '_dev/tmpl/*.html'
    },
    watch: {
        style: '_dev/scss/**/*.scss',
        img: '_dev/img/*.*',
        sprite: '_dev/img/sprite/*.*',
        js: '_dev/js/*',
        html: '_dev/tmpl/**/*.html'
    },
    clean: 'public/'
};

var config = {
    server: {
        baseDir: "public/"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('sprite:build', function () {
    var spriteData =
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                imgPath: '../img/sprite.png',
                padding: 3,
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 'i-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest(path.build.img));
    spriteData.css.pipe(gulp.dest('_dev/scss/inc/'));

});

gulp.task('sprite-retina', function () {
    var spriteRetinaData =
        gulp.src(path.src.spriteRetina)
            .pipe(spritesmith({
                imgName: 'sprite@2x.png',
                retinaSrcFilter: '_dev/img/sprite@2x/*@2x.png',
                retinaImgName: 'sprite@2x.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                imgPath: '/public/img/sprite.png',
                retinaImgPath: '/public/img/sprite@2x.png',
                cssVarMap: function(sprite) {
                    sprite.name = 'i-' + sprite.name
                }
            }));

    spriteRetinaData.img.pipe(gulp.dest(path.build.img));
    spriteRetinaData.css.pipe(gulp.dest(path.src.scss));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sass({
            errLogToConsole: true
        }))
        .on('error', console.log)
        .pipe(prefixer('last 4 versions'))
        .pipe(csso())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin())
        .on('error', console.log)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('build', [
    'html:build',
    'style:build',
    'image:build',
    'js:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);