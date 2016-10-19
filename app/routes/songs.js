import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('song', {include: 'book,book.editor,composer,languages,tags', sort:'book.name,song_no', 'filter[pdf_path]':'file.pdf'});
    //'filter[pdf_path]' param ensures that only songs that have an uploaded pdf are included on the songs page
  }
});
