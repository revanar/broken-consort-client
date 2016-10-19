import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  abbr: DS.attr(),
  year: DS.attr(),
  pdf: DS.attr(),
  remove_pdf_path: DS.attr(),

  songs: DS.hasMany('song'),
  editor: DS.belongsTo('editor')
});
