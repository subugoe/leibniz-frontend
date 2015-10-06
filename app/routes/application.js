import Ember from 'ember';

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  beforeModel: function() {
    // define the app's runtime locale
    // For example, here you would maybe do an API lookup to resolver
    // which locale the user should be targeted and perhaps lazily
    // load translations using XHR and calling intl's `addTranslation`/`addTranslations`
    // method with the results of the XHR request
    this.get('intl').setLocale('de-de');
  },
  renderTemplate: function() {
    this.render();
    this.render('nav', {
			into: 'application',
			outlet: 'nav'
		});
	}
});
