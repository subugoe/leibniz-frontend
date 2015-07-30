var gulp = require('gulp'),
	to5 = require('gulp-babel'),
	plumber = require('gulp-plumber'),
	gulp = require('gulp'),
	webdriver_update = require('gulp-protractor').webdriver_update,
	protractor = require("gulp-protractor").protractor

var paths = require('../config/paths')

// See https://github.com/mllrsohn/gulp-protractor for docs
gulp.task('webdriver_update', webdriver_update)

// Transpiles test scripts in from ES6 to ES5
gulp.task('build-e2e', function () {
	return gulp.src(paths.e2eSpecsSrc)
		.pipe(plumber())
		.pipe(to5())
		.pipe(gulp.dest(paths.e2eSpecsDist))
})

// Runs build-e2e task, then end-to-end test tasks
// using Protractor: http://angular.github.io/protractor/
gulp.task('e2e', ['webdriver_update', 'build-e2e'], function(cb) {
	return gulp.src(paths.e2eSpecsDist + "/*.js")
		.pipe(protractor({
			configFile: "protractor.conf.js",
			args: ['--baseUrl', 'http://127.0.0.1:9000']
		}))
		.on('error', function(e) { throw e })
})
