import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      songs: this.store.findAll('song', {include: 'composer,book,tags,languages'}),
      composers: this.store.findAll('composer'),
      books: this.store.findAll('book', {include: 'editor'}),
      tags: this.store.findAll('tag'),
      languages: this.store.findAll('language')
    });
  },
  controllerName: 'edit',
  deactivate() {
    this.controller.send('saveAll', 'song');
  },
  actions: {
    refreshPage(){
      console.log('refresh fired');
      this.get('target.router').refresh();
    }
  }
});
