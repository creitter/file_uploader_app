var FileCollectionView = Backbone.View.extend({
  initialize : function() {
    var that = this;
    this._fileViews = [];
    
    this.collection.each(function(file) {
      that._fileViews.push(new UpdatingUploadedFileView({model : file, tagName : 'li'}));
    });
  }
  
});

var UploadView2 = Backbone.View.extend({
  tagName : 'div',
  className : 'uploadView',
  render : function() {
    this.el.innerHTML = this.model.get('filename');
    return this;
  }
  
});


var UpdatingUploadedFileView = UploadView2.extend({
  initialize : function(options) {
    this.render = _.bind(this.render, this); 
 
    this.model.bind('change:name', this.render);
  }
});




var UploadView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function() {
    var template = _.template($("#upload_template").html(), {} );
    this.$el.html(template);
  },
  events: {
    "click input[type=submit]": "uploadFile",
  },
  uploadFile: function(evt) {
    evt.preventDefault();  // don't go anywhere 
    var file = document.getElementById("textfile").files[0];
    
    //Make sure we've actually selected a file
    if (file === undefined) {
      alert('Please choose a file first before selecting Upload');
      return;
    }
    
    var formData = new FormData();
    formData.append("textfile", file);
     
    var uploadedFile = new UploadedFile();
    var fileView = new FileView({model: uploadedFile});
    
    /** TODO: Corinne Use a Collection instead - Saturday project **/
    // I would rather just add this to a collection and let the collection view handle the rendering
    // but for the sake of time, we'll go old school
    $("#uploaded_files").prepend(fileView.render().el);

    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(evt) {
     if (evt.lengthComputable) {
       fileView.updateProgress(evt.loaded, evt.total);
     }
    };

    xhr.onload = function(evt) {
     fileView.hideProgress();
     $('#textfile').val('')
     var data = JSON.parse(xhr.responseText);
     fileView.showInfo(this.statusText, data.filename);
    }

    xhr.onreadystatechange = function() {
     if (xhr.readyState == 4) {
       var data = JSON.parse(xhr.responseText);
       uploadedFile.set({lines: data.lines, words:data.words, location: data.location, filename: data.filename, done: true });
     }; 
    }

    /* TODO: Corinne - Test these to ensure they work. Provide a better error message handling other than an alert */
    xhr.onabort = function () {
      alert("The upload was cancelled.");
    }
    xhr.onerror = function(e) {
      alert("There was an error with the upload. Error message=" + e)
    }
    xhr.ontimeout = function() {
      alert('The upload timedout. Please try again');
    }


    // Starting the upload process
    fileView.showProgress();
    xhr.open("post", "/file-upload", true);
    xhr.send(formData);
    }
});

/* Dislay a single file uploaded */
var FileView = Backbone.View.extend({
  template: _.template($("#uploaded_file_template").html()),
  
  render: function() {
    this.$el.html(this.template());
    return this;
   },
  
  initialize: function() {
    this.render = _.bind(this.render, this); 
    this.model.bind("change", this.updateModel, this);
  } ,
  
  events: {
    "click button.close": "removeFile",
    "click a.show-file" : "toggleLinkClicked"
  },
  
  removeFile: function() {
    this.$el.remove();
  },

  toggleLinkClicked: function(evt) {
    evt.preventDefault();
    if ($("span", evt.currentTarget).html() == "Show") {
      $("span", evt.currentTarget).html("Hide");
    } else {
      $("span", evt.currentTarget).html("Show");
    }
    this.$(".view").toggle();
  },

  updateModel: function() {
    /* TODO: Corinne - Using event delegation, when words and lines are updated, check plurality and update text accordingly */
    this.$(".words span", this.template()).html(this.model.get("words"));
    this.$(".lines span", this.template()).html(this.model.get("lines"));
    
    // Let's display the data we just uploaded
    var viewObj = this.$("pre.view");
    var theFile = this.model.get("location") + this.model.get("filename");
    $.get(theFile, function(data) {
      viewObj.text(data);
    });
  },
  
  updateProgress: function(loadedBytes, totalBytes) {
    var percentage = (loadedBytes / totalBytes) * 100;
    this.$("div.progress div.bar", this.template()).css("width", percentage + "%");
  },
  
  showProgress: function(){
    this.$("div.progress", this.template()).show();
  },
  
  hideProgress: function() {
    this.$("div.progress", this.template()).hide();
  },
  
  showInfo: function(statusText, filename) {
    this.$("strong.message", this.template()).text(statusText + " [ " + filename + " ]")
    this.$("div.alert", this.template()).show();
  }
});
  

/**  TODO: Corinne - Create a collection view so I could just add the uploads to this collection and allow the view to render and manage it.  But for the sake of time, we'll just leave it commented out.
var UploadedFileCollectionView = Backbone.View.extend({
  // 
  }
});
**/