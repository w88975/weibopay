var cwd = process.cwd();
var Path = require('path');
var Fs = require('fs');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');

// ## src目录映射到temp,并返回temp目录
var __src2temp = function (filePath, destType) {
    var destFileName = Path.basename(filePath).substring(0, Path.basename(filePath).indexOf('.')) + '.' + destType;
    var destPath = Path.dirname(filePath) + '/' + destFileName;
    return cwd + '/.temp/' + Path.relative(cwd + '/src/', destPath);
};

// ## 安全的删除文件
var __deleteFile = function (path) {
    if (Fs.existsSync(path)) {
        Fs.unlinkSync(path);
    }
};

gulp.task('sass', function() {
    return gulp.watch('src/**/*.scss', function(event) {
        var relativePath = Path.relative(cwd + '/src/',event.path);
        if (event.type === 'deleted') {
            __deleteFile(__src2temp(event.path,'css'));
        }

        gulp.src(event.path)
        .pipe(sass())
        .pipe(gulp.dest('.temp/' + Path.dirname(relativePath)))
        .pipe(reload({stream: true}));
    });
});

gulp.task('default',['sass'], function (cb) {
    browserSync.init({
        files: [
            'src/**/*.html',
            'src/**/*.htm',
            'src/**/*.css',
        ],
        server: {
            baseDir: ['src/','.temp']
        },
        port: 9111,
        https: true,
        open: false,
        online: false,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        reloadOnRestart: true,
        timestamps: true,
    });
});
