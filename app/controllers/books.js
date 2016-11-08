import Ember from 'ember';

export default Ember.Controller.extend({
  //query params
  collapsed: true,
  queryParams: ['sortBy', 'q_all', 'q_title', 'q_editor', 'q_year'],
  sortBy: '',
  q_all: '',
  q_title: '',
  q_editor: '',
  q_year: '',
  filteredModel: Ember.computed('model', 'q_all', 'q_title', 'q_editor', 'q_year', function(){
    let model = this.get('model').filterBy('pdf.pdf_path.url');
    this.get('queryParams').forEach((filter)=>{
      if ((filter !== 'sortBy') && (this.get(filter).length > 0)){
        //guardian pattern to remove invalid inputs
        let valid = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
        while (this.get(filter).length > 0 && !valid.test(this.get(filter))){
          this.set(filter, this.get(filter).slice(0,-1));
        }
        let regExp = new RegExp(this.get(filter), 'i');
        model = model.filter(function(model){
          return ((filter === "q_all" || filter === "q_title") ? regExp.test(model.get('name')): false ) ||
            ((filter === "q_all" || filter === "q_editor") ? regExp.test(model.get('editor').get('name')) : false ) ||
            ((filter === "q_all" || filter === "q_year") ? regExp.test(model.get('year')) : false);
        });
      }
    });
    return model;
  }),
  sortedBooks: Ember.computed.sort('filteredModel', 'sortDefinition').property('filteredModel', 'sortDefinition'),
  sortDefinition: Ember.computed('sortBy', function(){
    return [this.get('sortBy')];
  }),
  noResults: Ember.computed('filteredModel', function(){
    return !(this.get('filteredModel').length > 0);
  }).property('filteredModel'),
  actions: {
    toggleDisplay(id){
      Ember.$('#data-toggle-'+id).toggleClass('hidden');
    }
  }
});
