import Ember from 'ember';
import Solr from '../mixins/solr';

export default Ember.Route.extend(Solr, {
  actions: {
    queryParamsDidChange() {
      this.controllerFor('search').set('rendered', false);
      this.refresh();
    }
  },
  model(params) {
    // TODO: Include variants and add associated letters to results
    if ( ! params.query ) {
      return;
    }
    var q = `*${params.query}*`;
    var query = `type:brief AND (` +
                ` volltext:${q}` +
                ` OR id:${q}` +
                ` OR reihe:${q}` +
                ` OR band:${q}` +
                ` OR brief_nummer:${q}` +
                ` OR all_suggest:${q}` +
                ` OR ort_anzeige:${q}` +
                ` OR datum_anzeige:${q}` +
                ` OR datum_gregorianisch:${q}` +
                ` OR datum_julianisch:${q}` +
                ` OR kontext:${q}` +
                `)`;
    return this.query(query, {sort: params.order}).then( (json) => {
      var model = {query: params.q};
      if ( typeof json.response === 'object' && json.response.docs.length > 0 ) {
        model.results = json.response.docs;
        model.results.forEach( (letter) => {
          if (json.highlighting[letter.id].volltext) {
            letter.excerpt = this.strip(json.highlighting[letter.id].volltext);
          } else if (letter.volltext) {
            letter.excerpt = this.strip(letter.volltext.substr(0, 50));
          } else {
            letter.excerpt = null;
          }
          letter.sentByFocusPerson = ( letter.absender_nachname[0] === 'Leibniz' );
        });
      } else {
        model.results = [];
      }
      this.controllerFor('search').set('rendered', true);
      return model;
    }, function(error) {
      return {error: error};
    });
  },
  strip(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('rendered', true);
    this.controllerFor('application').set('showSearch', false);
  },
});
