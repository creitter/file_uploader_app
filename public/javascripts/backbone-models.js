/* Inspired by: http://liquidmedia.ca/blog/2011/01/backbone-js-part-1/ */

var UploadedFile = Backbone.Model.extend({
   // Default attributes
   defaults: function() {
     return {
       location: "",
       filename: "",
       words: 0,
       lines: 0,
       top_5: [],  //TODO: Corinne - There are plenty of 3rd party apps I can plug in here
       done: false //TODO: Corinne - Necessary for the still uploading part of the feature request?
     };
   },
   url : function() {
     return this.id ? '/uploaded_files/' + this.id : '/uploaded_files';
   },
   file: function() {
     return "/uploads/" + this.get('filename');
   }
 });

