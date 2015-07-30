var gulp = require('gulp'),
	del = require('del'),
	vinylPaths = require('vinyl-paths')

var paths = require('../config/paths')

gulp.task('clean', function() {
	return gulp.src([paths.jsDist, paths.stylesDist, paths.templatesDist])
		.pipe(vinylPaths(del))
})
