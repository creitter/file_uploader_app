/* Inspired from http://liquidmedia.ca/blog/2011/01/backbone-js-part-1/*/

var UploadedFiles = Backbone.Collection.extend({
  model: UploadedFile,
  url : '/uploaded_files'
});
