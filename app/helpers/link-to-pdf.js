import Ember from 'ember';

export function linkToPdf(params/*, hash*/) {
  let [model] = params;
  let href = Ember.Handlebars.Utils.escapeExpression(model.get('pdf.pdf_path.url'));
  return Ember.String.htmlSafe(`<a class="btn btn-default" href=${href}>pdf</a>`);
}

export default Ember.Helper.helper(linkToPdf);
