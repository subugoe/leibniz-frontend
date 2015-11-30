import Ember from 'ember';

export default Ember.Component.extend({
  otherVariantsVisible: true,
  actions: {
    toggleVariants(witnessId) {
      if ( witnessId === 'other' ) {
        this.set('otherVariantsVisible', ! this.get('otherVariantsVisible'));
      } else {
        this.get('content.witnesses').forEach( (item, index, witnesses) => {
          var witness = witnesses.objectAt(index);
          if ( witness.identifier === witnessId ) {
            return Ember.set(witness, 'visible', ! witness.visible);
          }
        });
      }
      this.get('content.variants').forEach( (item, index, variants) => {
        var variant = variants.objectAt(index);
        var toggleIndexedAndHasIndexedWitness = ( variant.textzeuge && variant.textzeuge[0] === witnessId );
        var toggleOtherAndHasOtherWitness = ( witnessId === 'other' && ! variant.witnessIndex );
        if ( toggleIndexedAndHasIndexedWitness || toggleOtherAndHasOtherWitness ) {
          return Ember.set(variant, 'visible', ! variant.visible);
        }
      });
      Ember.run.scheduleOnce('afterRender', () => {
        this.sendAction('positionVariants');
      });
    }
  }
});
