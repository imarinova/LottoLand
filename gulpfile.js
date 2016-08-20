// ////////////////////////////////////////////////////////
// Required
// ///////////////////////////////////////////////////////

var gulp =  require('gulp'),
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	watchify = require('watchify'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	less = require('gulp-less'),
	notify = require('gulp-notify'),
	browserSync = require('browser-sync'),
	browserify = require('browserify');

var reload = browserSync.reload;

var dependencies = [ 'jquery', 'underscore', '_date' ];

// ////////////////////////////////////////////////////////
// Scripts Tasks
// ///////////////////////////////////////////////////////

// gulp.task('scripts', function() {
// 	gulp.src(['js/*.js'])
// 	// .pipe(rename({
//  //      suffix:'.min'
//  //    }))
// 	// .pipe(uglify())
//     // .pipe(gulp.dest('js'))
//     .pipe(reload({
// 			stream: true
// 		}));
// });

// ////////////////////////////////////////////////////////
// Less Tasks
// ///////////////////////////////////////////////////////
gulp.task('less', function(){
	gulp.src('less/**/style.less')
		// .pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest('css'))
		.pipe(reload({
			stream: true
		}));
});

// ////////////////////////////////////////////////////////
// HTML Tasks
// ///////////////////////////////////////////////////////
gulp.task('html', function(){
	gulp.src('**/*.html')
	.pipe(reload({
		stream: true
	}));
});

// ////////////////////////////////////////////////////////
// BrowserSync Tasks
// ///////////////////////////////////////////////////////
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: "./"
		}
	})
});


// ////////////////////////////////////////////////////////
// Watch Tasks
// ///////////////////////////////////////////////////////
gulp.task('watch', function(){
	// gulp.watch('js/**/*.js', ['scripts']);
	gulp.watch('less/**/*.less', ['less'])
	gulp.watch('**/*.html', ['html'])
});

gulp.task('app', function()
{
    var appBundler = browserify({
    	entries: 'js/script.js',
        cache: {},
        packageCache: {}
    });

    appBundler.external(dependencies);

    var rebundle = function () {
        var start = Date.now();
        console.log( gutil.colors.grey('Building APP bundle') );

        appBundler
            .bundle().on('error', gutil.log)
            .pipe( source('app.js') )
            // .pipe( gulpif(!developMode, streamify( uglify().on('error', gutil.log) ) ) )
            // .pipe(gulpif(!developMode, streamify(stripDebug())))
            .pipe( gulp.dest('./build'))
            .pipe(reload({
				stream: true
			}));
            // .pipe(notify(function () {
            //     var execTime = (Date.now() - start);
            //     return {
            //         title: ' App build in',
            //         message: +execTime+ ' ms'//,
            //         //icon: ICON_PATH
            //     };
            //}));
    };

    appBundler.on('error', function () {
        console.log("bundle error", arguments);
    });

	rebundle();
    
    watchify(appBundler, {poll: 750})
        .on('update', rebundle)
});

gulp.task('vendor', function()
{
    var vendorsBundler = browserify({
    	cache: {},
        packageCache: {},
        require: dependencies,
        fullPaths: true
    });

    var start = new Date();

    console.log( gutil.colors.grey('Building VENDORS bundle') );

    vendorsBundler.bundle().on('error', gutil.log)
        .pipe(source('vendors.js'))
        // .pipe( gulpif(!developMode, streamify( uglify().on('error', gutil.log) ) ) )
        .pipe(gulp.dest('./build'));
        
});

// ////////////////////////////////////////////////////////
// Default Tasks
// ///////////////////////////////////////////////////////
// gulp.task('default', ['scripts', 'less', 'html', 'browser-sync', 'watch']);
gulp.task('default', ['less', 'html', 'browser-sync', 'watch', 'app', 'vendor']);