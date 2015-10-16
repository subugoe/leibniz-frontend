import Ember from 'ember';

export default Ember.Controller.extend({
  showNav: false,
  actions: {
    toggleNav: function() {
      this.set('showNav', ! this.get('showNav'));
      var duration = parseFloat(Ember.$('.main').css('transition-duration')) * 1000;
      var runningTime = 0;
      var interval = setInterval( () => {
         Ember.$(window).trigger('resize');
         console.dir('tr');
         runningTime += 100;
         if ( runningTime > duration ) {
           clearInterval(interval);
         }
      }, 100);
    }
  },
});
