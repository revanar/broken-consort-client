import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('song', {include: 'book,book.editor,composer,languages,tags'});
    //'filter[pdf_path]' param ensures that only songs that have an uploaded pdf are included on the songs page
  }
});
