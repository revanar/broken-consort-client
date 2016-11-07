import Ember from 'ember';

export function linkToPdf(params/*, hash*/) {
  let [model] = params;
  let href = Ember.Handlebars.Utils.escapeExpression(model.get('pdf.pdf_path.url'));
  if (model.get('thumb.thumb_path.url')){
    let src = Ember.Handlebars.Utils.escapeExpression(model.get('thumb.thumb_path.url'));
    return Ember.String.htmlSafe(`<a href=${href}><img src=${src}></a>`)
  } else {
    return Ember.String.htmlSafe(`<a class="btn btn-default" href=${href}>pdf</a>`);
  }
}

export default Ember.Helper.helper(linkToPdf);
