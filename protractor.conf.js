exports.config = {
	directConnect: true,

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome'
	},

	// Selenium address: 'http://0.0.0.0:4444',
	// Add proper version number!
	seleniumServerJar: './node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
	specs: ['specs/e2e/dist/*.js'],

	plugins: [{
		path: 'aurelia.protractor.js'
	}],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};
