var path = require('path')

var srcRoot = 'src/',
	distRoot = 'dist/'

module.exports = {
	doc:           './doc',
	e2eSpecsSrc:   'test/e2e/src/*.js',
	e2eSpecsDist:  'test/e2e/dist/',
	jsSrc:          srcRoot + 'js/**/*.js',
	jsDist:        distRoot + 'js/',
	stylesSrc:      srcRoot + 'sass/**/*.scss',
	stylesDist:    distRoot + 'styles/',
	templatesSrc:   srcRoot + 'templates/**/*.html',
	templatesDist: distRoot + 'templates/'
}
