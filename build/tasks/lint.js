var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	scsslint = require('gulp-scss-lint')

var paths = require('../config/paths')

gulp.task('lint-js', function() {
	return gulp.src(paths.jsSrc)
		.pipe(eslint('build/config/eslint.json'))
		.pipe(eslint.format())
})

gulp.task('lint-styles', function() {
	return gulp.src(paths.stylesSrc)
		.pipe(scsslint({config: 'build/config/scss-lint.yml', maxBuffer: 999999}))
})

gulp.task('lint', ['lint-js', 'lint-styles'])
