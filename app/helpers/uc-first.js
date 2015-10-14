import Ember from 'ember';

export function ucFirst(params) {
  var str = params[0];
  str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  });
  return str;
}

export default Ember.Helper.helper(ucFirst);
