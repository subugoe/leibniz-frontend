import Ember from 'ember';
import Solr from '../mixins/solr';

export default Ember.Route.extend(Solr, {
  intl: Ember.inject.service(),
  model() {
    return this.loadAllLettersInVolume();
  },
  beforeModel() {
    // define the app's runtime locale
    // For example, here you would maybe do an API lookup to resolver
    // which locale the user should be targeted and perhaps lazily
    // load translations using XHR and calling intl's `addTranslation`/`addTranslations`
    // method with the results of the XHR request
    this.get('intl').setLocale('de-de');
  },
  renderTemplate() {
    this.render();
    this.render('nav', {
			into: 'application',
			outlet: 'nav'
		});
	},
  loadAllLettersInVolume() {
    return this.query('type:brief', {fl: 'id, band, reihe, brief_nummer', sort: 'reihe asc, band asc, brief_nummer asc'}).then( (json) => {
      if ( json.response.docs.length > 0 ) {
        return json.response.docs;
      }
    });
  },
});
