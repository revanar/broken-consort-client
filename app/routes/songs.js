import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('song', {include: 'book,book.editor,composer,languages,tags'});
  },
  queryParams: {
    sortBy: {as:'s', replace:true},
    hidden: {replace:true},
    q_all: {replace:true},
    q_title: {replace:true},
    q_creator: {replace:true},
    q_editor: {replace:true},
    q_song_no: {replace:true},
    q_book_title: {replace:true},
    q_year: {replace:true},
    q_languages: {replace:true},
    q_tags: {replace:true},
  }
});
