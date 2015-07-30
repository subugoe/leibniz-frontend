var gulp = require('gulp'),
	browserSync = require('browser-sync')

var paths = require('../config/paths')

// Outputs changes to files to the console
function reportChange(event){
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
}

gulp.task('watch', ['serve'], function() {
	gulp.watch(paths.jsSrc, ['build-js', browserSync.reload]).on('change', reportChange)
	gulp.watch(paths.stylesSrc, browserSync.reload).on('change', reportChange)
	gulp.watch(paths.templatesSrc, ['build-templates', browserSync.reload]).on('change', reportChange)
})

gulp.task('default', ['watch'])
