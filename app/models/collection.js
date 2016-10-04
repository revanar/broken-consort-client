import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  creator: DS.attr(),
  desc: DS.attr(),
  thumb_path: DS.attr(),
  pdf_path: DS.attr()
});
