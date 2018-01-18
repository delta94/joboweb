'use strict'
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
var concat = require('gulp-concat');

var name = new Date().getTime() +'.js'


gulp.paths = {
    dist: 'dist'
};

var paths = gulp.paths;


gulp.task('up-serverAna', function () {
    return replacePure({
        regex: "http://localhost:8081",
        replacement: "https://jobo-ana.herokuapp.com",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
});

gulp.task('down-serverAna', function () {
    return replacePure({
        regex: "https://jobo-ana.herokuapp.com",
        replacement: "http://localhost:8081",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false,
    });
})
gulp.task('up-server', function () {
    return replacePure({
        regex: "http://localhost:8080",
        replacement: "https://jobo-server.herokuapp.com",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false
    });
});

gulp.task('down-server', function () {
    return replacePure({
        regex: "https://jobo-server.herokuapp.com",
        replacement: "http://localhost:8080",
        paths: ['./js/config.js'],
        recursive: false,
        silent: false,
    });
})

gulp.task('newjs', function () {
    return replacePure({
        regex: '<script src="employer/edash.js"></script><script src="employer/viewprofile.js"></script><script src="employer/store.js"></script><script src="jobseeker/sdash.js"></script><script src="jobseeker/viewstore.js"></script><script src="jobseeker/sprofile.js"></script><script src="templates/intro.js"></script><script src="templates/dashboard.js"></script><script src="templates/setting.js"></script>',
        replacement: '<script src="js/'+ name +'"></script>',
        paths: ['./dist/index.html'],
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
    return gulp.src(['index.html','manifest.json','.htaccess','firebase-messaging-sw.js'])
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


gulp.task('strip', function () {
    return gulp.src([paths.dist+ '/js/services.js',paths.dist+ '/js/app.js',paths.dist+ '/js/'+ name])
        .pipe(stripDebug())
        .pipe(gulp.dest(paths.dist+ '/js'));
});

gulp.task('concat', function() {
    return gulp.src([paths.dist+ '/jobseeker/*.js',paths.dist+ '/employer/*.js',paths.dist+ '/templates/*.js'])
        .pipe(concat(name))
        .pipe(gulp.dest(paths.dist+'/js'));
});


gulp.task('build:dist', function (callback) {
    runSequence(
        'clean:dist',
        'up-server',
        'up-serverAna',
        'edit',
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
        'replace:bower',
        'down-server',
        'down-serverAna',
        'unedit',
        'unedit1',
        'concat',
        'newjs',
        'strip',


        callback);
});

gulp.task('default', ['serve']);
