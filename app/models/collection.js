import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  creator: DS.attr(),
  desc: DS.attr(),
  pdf: DS.attr(),
  remove_pdf_path: DS.attr(),
  thumb: DS.attr(),
  remove_thumb_path: DS.attr(),
});
