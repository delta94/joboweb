'use strict'
var firebase = require("firebase-admin");
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var replacePure = require('replace');
var stripDebug = require('gulp-strip-debug');

firebase.initializeApp({
    credential: firebase.credential.cert('adminsdk.json'),
    databaseURL: "https://jobo-b8204.firebaseio.com"
});


var t

gulp.paths = {
    dist: 'dist'
};

var paths = gulp.paths;

gulp.task('up-server', function () {
    return replacePure({
        regex: "http://localhost:8080",
        replacement: "https://jobohihi.herokuapp.com",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
});

gulp.task('down-server', function () {
    return replacePure({
        regex: "https://jobohihi.herokuapp.com",
        replacement: "http://localhost:8080",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false,
    });
})
gulp.task('edit', function () {
    return replacePure({
        regex: "'Location': false",
        replacement: "'Location': true",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
})
gulp.task('unedit', function () {
    return replacePure({
        regex: "'Location': true",
        replacement: "'Location': false",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
})
gulp.task('time', function () {

    t = JSON.stringify(new Date())
    firebase.database().ref('config').update({updateTime: t})


    return replacePure({
        regex: "'now'",
        replacement: t,
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
})
gulp.task('untime', function () {
    return replacePure({
        regex: t,
        replacement: "'now'",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
})

gulp.task('edit1', function () {
    return replacePure({
        regex: "<!--<base href='/'>-->",
        replacement: "<base href='/'>",
        paths: ['./index.html'],
        recursive: false,
        silent: false,
    });
})
gulp.task('unedit1', function () {
    return replacePure({
        regex: "<base href='/'>",
        replacement: "<!--<base href='/'>-->",
        paths: ['./index.html'],
        recursive: false,
        silent: false,
    });
})


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

// Static Server without watching scss files
gulp.task('serve:lite', function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch('**/*.css').on('change', browserSync.reload);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

gulp.task('sass', function () {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss');
});

gulp.task('clean:dist', function () {
    return del(paths.dist);
});


gulp.task('copy:bower', function () {
    return gulp.src(mainBowerFiles(['**/*.js', '!**/*.min.js']))
        .pipe(gulp.dest(paths.dist + '/js/libs'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});

gulp.task('copy:bowerlib', function () {
    return gulp.src('./www/libs/**/*')
        .pipe(gulp.dest(paths.dist + '/js/libs'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});


gulp.task('copy:css', function () {
    return gulp.src('./css/**/*')
        .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('copy:img', function () {
    return gulp.src('./img/**/*')
        .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('copy:fonts', function () {
    return gulp.src('./fonts/**/*')
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('copy:js', function () {
    return gulp.src('./js/**/*')
        .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('copy:views', function () {
    return gulp.src('./views/**/*')
        .pipe(gulp.dest(paths.dist + '/views'));
});
gulp.task('copy:spinner', function () {
    return gulp.src('bower_components/angular-spinner/dist/angular-spinner.min.js')
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});
gulp.task('copy:socialshare', function () {
    return gulp.src('bower_components/angular-socialshare/dist/angular-socialshare.min.js')
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});
gulp.task('copy:upload', function () {
    return gulp.src('bower_components/ng-file-upload/ng-file-upload-shim.min.js')
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});
gulp.task('copy:toaster', function () {
    return gulp.src('bower_components/angular-toastr/dist/angular-toastr.min.css')
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});
gulp.task('copy:gallery', function () {
    return gulp.src('bower_components/ng-image-gallery/dist/ng-image-gallery.min.css')
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});

gulp.task('copy:employer', function () {
    return gulp.src('./employer/**/*')
        .pipe(gulp.dest(paths.dist + '/employer'));
});
gulp.task('copy:jobseeker', function () {
    return gulp.src('./jobseeker/**/*')
        .pipe(gulp.dest(paths.dist + '/jobseeker'));
});
gulp.task('copy:templates', function () {
    return gulp.src('./templates/**/*')
        .pipe(gulp.dest(paths.dist + '/templates'));
});

gulp.task('copy:html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:mani', function () {
    return gulp.src(['manifest.json'])
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:ht', function () {
    return gulp.src(['.htaccess'])
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:firebase', function () {
    return gulp.src(['firebase-messaging-sw.js'])
        .pipe(gulp.dest(paths.dist + '/'));
});
gulp.task('replace:bower', function () {
    return gulp.src([
        './dist/**/*.html',
        './dist/**/*.js',
    ], {base: './'})
        .pipe(replace(/bower_components+.+(\/[a-z0-9][^/]*\.[a-z0-9]+(\'|\"))/ig, 'js/libs$1'))
        .pipe(gulp.dest('./'));
});


gulp.task('strip-1', function () {
    return gulp.src(paths.dist+ '/templates/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest(paths.dist+ '/templates/'));
});
gulp.task('strip-2', function () {
    return gulp.src(paths.dist+ '/employer/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest(paths.dist+ '/employer/'));
});
gulp.task('strip-3', function () {
    return gulp.src(paths.dist+ '/jobseeker/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest(paths.dist+ '/jobseeker/'));
});
gulp.task('build:dist', function (callback) {
    runSequence(
        'clean:dist',
        'up-server',
        'edit',
        'time',
        'edit1',
        'copy:bower',
        'copy:css',
        'copy:img',
        'copy:spinner',
        'copy:socialshare',
        'copy:upload',
        'copy:toaster',
        'copy:gallery',
        'copy:fonts',
        'copy:js',
        'copy:views',
        'copy:employer',
        'copy:jobseeker',
        'copy:templates',
        'copy:html',
        'copy:ht',
        'copy:mani',
        'copy:firebase',
        'replace:bower',
        'down-server',
        'unedit',
        'unedit1',
        'untime',
        'strip-1',
        'strip-2',
        'strip-3',

        callback);
});

gulp.task('default', ['serve']);
