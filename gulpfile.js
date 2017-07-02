const 	gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require('gulp-notify'),
		htmlPartial    = require('gulp-html-partial')
		htmlmin        = require('gulp-html-minifier');

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery.min.js',
		'app/libs/hamburger.js',
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', function() {
	return gulp.src(['app/sass/**/*.scss', '!app/sass/nocompile/*.scss'])
	.pipe(sass().on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(concat('main.min.css'))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src(['app/templates/*.html'])
	.pipe(htmlPartial({
		basePath: 'app/partials/',
		tagName: 'part',
        variablePrefix: '@@'
	}))
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'html'], function() {
	gulp.watch(['app/partials/*.html', 'app/templates/*.html'], ['html']);
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js', 'html'], function() {

	var buildFiles = gulp.src([
		'app/*.html'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch', 'browser-sync']);
