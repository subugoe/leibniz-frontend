import Ember from 'ember';
import Lane from '../mixins/lane';

export default Ember.Component.extend(Lane, {
  otherVariantsVisible: true,
  actions: {
    toggleVariants() {
      this.toggleVariant();
    },
    toggleWitness(witnessId) {
      // determine whether or not the button for the witness is shown

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

      Ember.run.scheduleOnce('afterRender', () => {
        this.toggleVariants();
      });
    }
  },
  toggleVariants() {
    // variants are shown when:
    // one of their witnesses is active, or
    // it has others or no witness and the "others"-button is active, or
    // it has a witness which is never shown anyway (e.g. Lil)

    this.get('content.variants').forEach( (item, index, variants) => {
      var showVariant = false;
      var variant = variants.objectAt(index);
      if ( variant.textzeuge ) {
        variant.textzeuge.forEach((elem) => {
          let hasWitnessButtons = Ember.$('.variants .variants_button:contains("'+elem+'")');
          if ( hasWitnessButtons.length > 0 ) {
            // variants witness has a button which is shown
            hasWitnessButtons.each((index,elem) => {
              if(Ember.$(elem).hasClass('-active')) {
                showVariant = true;
              }
            });
          } else {
            if ( Ember.$('.variants .variants_button:contains("'+elem+'")').length === 0 ) {
              // variant has witness, but witness has no button at all (e.g. Lil)
              showVariant = true;
            } else if ( Ember.$('.variants .variants_button:contains("Sonstige")').hasClass('-active') ) {
              // variant has no witness
              showVariant = true;
            } else {
            }
          }
        });
      } else {
        // variant doesn't have a witness and is only shown when "others" are active
        if ( Ember.$('.variants .variants_button:contains("Sonstige")').hasClass('-active') ) {
          showVariant = true;
        }
      }
      if ( showVariant === false ) {
        // respecting reference has to be de-highlighted
        var $references = Ember.$('.lane.transcript').find(`[data-id=${variant.id}], [data-ref-id=${variant.id}]`);
        $references.removeClass('-highlight');
      }
      return Ember.set(variant, 'visible', showVariant);
    });
    Ember.run.scheduleOnce('afterRender', () => {
      this.sendAction('positionVariants');
    });
  }
});
