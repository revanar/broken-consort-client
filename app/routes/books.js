import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('book', {include: 'editor', 'filter[pdf_path]':'file.pdf'});
    //note: 'filter[pdf_path]' returns only books that have an uploaded pdf transcription
  }
});
