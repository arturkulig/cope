var gulp = require('gulp'),
    fs = require('fs'),
    wrap = require("gulp-wrap"),
    include = require("gulp-include"),
    rename = require("gulp-rename"),
    babel = require("gulp-babel");


var wrappers = {
    es6: function () {
        return fs.readFileSync('wraps/es6.js', "utf8");
    },
    umd: function () {
        return fs.readFileSync('wraps/umd.js', "utf8");
    },
    iife: function () {
        return fs.readFileSync('wraps/iife.js', "utf8");
    }
};

var js_files = {
    "input": {
        es6: "./wraps/es6.js",
        iife: "./wraps/iife.js",
        umd: "./wraps/umd.js"
    },
    "output": {
        es6: "./dist/cope.es6.js",
        iife: "./dist/cope.iife.js",
        umd: "./dist/cope.umd.js"
    },
    "all": ["./src/*.js"]
};


function preventFromQuitting(error) {
    console.log(error);
    console.log('----------------------------------------');
    this.emit("end");
}

gulp.task('js-umd', function () {
    return gulp
        .src(js_files.input.umd)
        .pipe(include())
        .on("error", preventFromQuitting)
        .pipe(babel())
        .on("error", preventFromQuitting)
        .pipe(rename(js_files.output.umd))
        .pipe(gulp.dest('.'));
});

gulp.task('js-iife', function () {
    return gulp
        .src(js_files.input.iife)
        .pipe(include())
        .on("error", preventFromQuitting)
        .pipe(babel())
        .on("error", preventFromQuitting)
        .pipe(rename(js_files.output.iife))
        .pipe(gulp.dest('.'));
});

gulp.task('js-es6', function () {
    return gulp
        .src(js_files.input.es6)
        .pipe(include())
        .on("error", preventFromQuitting)
        .pipe(rename(js_files.output.es6))
        .pipe(gulp.dest('.'));
});

gulp.task('js', ['js-umd', 'js-es6', 'js-iife']);

gulp.task("watch", function () {
    gulp.watch(['wraps/*.js'].concat(js_files.all), ['js']);
});

gulp.task('default', ['js', 'watch']);
gulp.task('build', ['js']);
