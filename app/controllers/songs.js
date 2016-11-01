import Ember from 'ember';

export default Ember.Controller.extend({
  init () {
    this._super();
    //adds the glyphicons to rows that have already been sorted on page load
    Ember.run.schedule("afterRender",this,function() {
      let param = this.get('sortBy').replace('.', '-');
      if (param.includes(':asc')){
        let x = param.slice(0,-4);
        Ember.$('#'+x).append('<span class="glyphicon glyphicon-triangle-bottom" />');
      } else if (param.includes(':desc')){
        let x = param.slice(0,-5);
        Ember.$('#'+x).append('<span class="glyphicon glyphicon-triangle-top" />');
      }
    });
  },
  //query parameters
  queryParams: ['sortBy', 'searchTerm'],
  sortBy: '',
  searchTerm: '',
  //when searchTerm changes, ensures the model updates
  searchTermChanged: Ember.observer('searchTerm', function(){
    Ember.run.schedule("afterRender",this,function(){
      this.get('filteredModel').notifyPropertyChange('searchTerm');
    });
  }),
  //filters model based on searchTerm value
  filteredModel: Ember.computed('model', 'searchTerm', function(){
    let model = this.get('model');
    let regExp = new RegExp(this.get('searchTerm'), 'i');
    return model.filter(function(model){
      let langRes = model.get('languages').filter(item => {return regExp.test(item.get('name'));});
      let tagRes = model.get('tags').filter(item => {return regExp.test(item.get('name'));});
      return langRes.length > 0 ||
        tagRes.length > 0 ||
        regExp.test(model.get('name')) ||
        regExp.test(model.get('song_no')) ||
        regExp.test(model.get('book').get('name')) ||
        regExp.test(model.get('book').get('editor').get('name')) ||
        regExp.test(model.get('book').get('year'));
    });
  }).property('searchTerm'),
  //this is the model after filters and sorting have been applied
  sortedSongs: Ember.computed.sort('filteredModel', 'sortDefinition').property('filteredModel', 'sortDefinition'),
  //when sortBy changes, ensures the model updates
  sortDefinition: Ember.computed('sortBy', function(){
    return [this.get('sortBy')];
  }),
  actions: {
    //action that occurs when you click on a sortable column header
    setSortBy(value){
      if (this.get('sortBy') === value + ':asc') {
        //if sorted asc, change to desc
        Ember.$(event.target).find('span').remove();
        Ember.$(event.target).append('<span class="glyphicon glyphicon-triangle-top" />');
        this.set('sortBy', value + ':desc');
      } else if (this.get('sortBy') === value + ':desc') {
        //if sorted desc, change back to default sorting
        Ember.$(event.target).find('span').remove();
        this.set('sortBy', '');
      } else {
        //if default sorting, change to asc
        Ember.$('.list-sortable').find('span').remove();
        Ember.$(event.target).append('<span class="glyphicon glyphicon-triangle-bottom" />');
        this.set('sortBy', value + ':asc');
      }
    }
  }
});
