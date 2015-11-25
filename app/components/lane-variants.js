import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleVariants(witnessId) {
      this.get('content.witnesses').forEach( (item, index, witnesses) => {
        var witness = witnesses.objectAt(index);
        if ( witness.identifier === witnessId ) {
          return Ember.set(witness, 'visible', ! witness.visible);
        }
      });
      this.get('content.variants').forEach( (item, index, variants) => {
        var variant = variants.objectAt(index);
        if ( variant.textzeuge && variant.textzeuge[0] === witnessId ) {
          return Ember.set(variant, 'visible', ! variant.visible);
        }
      });
      Ember.run.scheduleOnce('afterRender', () => {
        this.sendAction('positionVariants');
      });
    }
  }
});
