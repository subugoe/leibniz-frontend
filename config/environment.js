/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'leibniz-frontend',
    environment: environment,
    baseURL: '/',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' http://leibniz.sub.uni-goettingen.de",
      'font-src': "'self'",
      'connect-src': "'self' http://leibniz.sub.uni-goettingen.de",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    },
    intl: {
      defaultLocale: 'de-de'
    },
    firstLetterID: 'l3747', // TODO: Get first letter ID from Sole
    solrURL: 'http://leibniz.sub.uni-goettingen.de/solr/leibniz/select',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
