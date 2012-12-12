var UploadedFile = Backbone.Model.extend({
   file: function() {
     return "/uploads/" + this.get('filename');
   },
   // Default attributes
   defaults: function() {
     return {
       _location: "",
       _filename: "",
       _words: 0,
       _lines: 0,
       _top_5: [],  //TODO: Corinne - There are plenty of 3rd party apps I can plug in here
       _done: false //TODO: Corinne - Necessary for the still uploading part of the feature request?
     };
   },
   initialize: function() {
   }
 });
