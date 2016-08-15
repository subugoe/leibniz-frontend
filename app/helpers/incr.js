import Ember from 'ember';

const incr = (params) => params[0] + 1;

export default Ember.Helper.helper(incr);

