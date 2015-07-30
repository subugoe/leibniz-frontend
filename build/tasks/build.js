// TODO: Add "production" task that outputs compressed JS and CSS

var gulp = require('gulp'),
	assign = Object.assign || require('object.assign'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	changed = require('gulp-changed'),
	plumber = require('gulp-plumber'),
	runSequence = require('run-sequence'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps')

var paths = require('../config/paths'),
	babelOptions = require('../config/babel')

// Transpile changed ES6 files to SystemJS format. The plumber() call
// prevents 'pipe breaking' caused by errors from other gulp plugins.
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-js', function() {
	return gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(changed(paths.jsDist, {extension: '.js'}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(babel(assign({}, babelOptions, {modules:'system'})))
		.pipe(sourcemaps.write({includeContent: true}))
		.pipe(gulp.dest(paths.jsDist))
})

// Transpile changed SCSS to CSS, add sourcemaps and vendor prefixes.
// https://github.com/ByScripts/gulp-sample/blob/master/gulpfile.js
gulp.task('build-styles', function() {
	return gulp.src(paths.stylesSrc)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write({includeContent: false}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.stylesDist))
})

// Copy changed HTML files to the output directory.
gulp.task('build-templates', function() {
	return gulp.src(paths.templatesSrc)
		.pipe(changed(paths.templatesDist, {extension: '.html'}))
		.pipe(gulp.dest(paths.templatesDist))
})

// Call the clean task (located in ./clean.js), then run the js,
// styles and templates tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
	return runSequence(
		'clean',
		['build-js', 'build-styles', 'build-templates'],
		callback
	)
})
