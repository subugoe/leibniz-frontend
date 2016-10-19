/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'leibniz-frontend',
    environment: environment,
    baseURL: '/',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "*",
      'font-src': "*",
      'connect-src': "*",
      'img-src': "'self' data:",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    },
    firstLetterID: 'l3714', // TODO: Get first letter ID from Solr
    solrURL: 'http://leibnizdev.sub.uni-goettingen.de/solr/leibniz/select',
    texName: false,
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
    ENV.solrURL = 'http://leibnizdev.sub.uni-goettingen.de/solr/leibniz/select';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.texName = true;
  }

  if (environment === 'test') {
    ENV.solrURL = 'http://leibnizdev.sub.uni-goettingen.de/solr/leibniz/select';

    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.solrURL = 'http://leibniz.sub.uni-goettingen.de/solr/leibniz/select';
    ENV.texName = false;
  }

  return ENV;
};
