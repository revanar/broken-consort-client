import Ember from 'ember';

export default Ember.Component.extend({
  record: Ember.computed('model', function(){
    return this.get('model').get('songs');
  }),
  song_no: ['song_no'],
  sortedSongs: Ember.computed.sort('record', 'song_no').property('record'),
 });
