import Ember from 'ember';
import Lane from '../mixins/lane';

export default Ember.Component.extend(Lane, {
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
          if ( variant.visible ) {
            var $references = Ember.$('.lane.transcript').find(`[data-id=${variant.id}], [data-ref-id=${variant.id}]`);
            $references.removeClass('-highlight');
          }
          return Ember.set(variant, 'visible', ! variant.visible);
        }
      });
      Ember.run.scheduleOnce('afterRender', () => {
        this.sendAction('positionVariants');
      });
    }
  }
});
