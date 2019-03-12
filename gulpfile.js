/**
 * Created by ponomarev-iv on 14.12.2016.
 */
'use strict';

const gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    csso = require('gulp-csso'),
    browsersync = require("browser-sync").create();

const path = {
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

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "public/"
        },
        port: 9000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function style() {
    return gulp
        .src(path.src.style)
        .pipe(sass({
            errLogToConsole: true
        }))
        .on('error', console.log)
        .pipe(prefixer('last 3 versions'))
        .pipe(csso())
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return gulp
        .src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream());
}


function html() {
    return gulp
        .src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
}

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

function watchFiles() {
    gulp.watch([path.watch.style], style);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.src.html], gulp.series(html, browserSyncReload));
}

// Tasks
gulp.task("css", style);
gulp.task("js", js);
gulp.task("html", html);

gulp.task('build', gulp.parallel(style, js, html));

// watch
gulp.task("watch", gulp.parallel(watchFiles, browserSync));