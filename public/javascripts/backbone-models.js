var UploadedFile = Backbone.Model.extend({
   defaults : function() {
     return {
       filename: "",
       words: 0,
       lines: 0,
       top_5: [],
       loadedBytes: 0, 
       totalBytes: 0,
       start: false,
       done: false
     };
   },
   initialize : function(file) {
     // Use for validations for file param or setting defaults if not using the defaults function above.
   },
   validate : function(file) {
     // Use for validations for file when setting attributes of the file.
   },
   url : function() {
     return this.id ? '/uploaded_files/' + this.id : '/uploaded_files';
   },
   file : function() {
     return "/uploads/" + this.get('filename');
   }
 });

