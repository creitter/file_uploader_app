/** To handle when a file gets uploaded */
var UploadView = Backbone.View.extend({
  initialize: function(){
   
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
    this.collection.add(uploadedFile);
    
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(evt) {
     if (evt.lengthComputable) {
       uploadedFile.set('totalBytes', evt.total);
       uploadedFile.set('loadedBytes', evt.loaded);
     }
    };

    xhr.onload = function(evt) {
      $('#textfile').val('')
      var data = JSON.parse(xhr.responseText);
      uploadedFile.set('filename', data.filename);
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
    uploadedFile.set({start: true});
    
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
    this.model.bind("change:start", this.showProgress, this);
    this.model.bind("change:loadedBytes", this.updateProgress, this);
    this.model.bind("change:words", this.updateModel, this);
  },
  
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
    this.showInfo();
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
  
  updateProgress: function() {
    var percentage = (this.model.get('loadedBytes') / this.model.get('totalBytes')) * 100;
    this.$("div.progress div.bar", this.template()).css("width", percentage + "%");
  },
  
  showProgress: function(){
    this.$("div.progress", this.template()).show();
  },
  
  hideProgress: function() {
    this.$("div.progress", this.template()).hide();
  },
  
  showInfo: function() {
    this.hideProgress();
    var statusText = "TODO";
    this.$("strong.message", this.template()).text(statusText + " [ " + this.model.get('filename') + " ]")
    this.$("div.alert", this.template()).show();
  }
});

/* Display collection of file views */
var FileCollectionView = Backbone.View.extend({
  template : _.template($("#uploaded_files_template").html()),
  initialize : function() {
    _(this).bindAll('add', 'remove');
    
    this._fileViews = [];

    this.collection.each(this.add)    
    this.collection.bind("add", this.add);
  },
  render : function() {
    var that = this;
    
    this.$el.html(this.template());
    
    _(this._fileViews).each(function (fv) {
      $(that.el).append(fv.render().el);
    });
  },
  add: function(file) {
    var fileView = new FileView({model: file});
    this._fileViews.push(fileView);
   // if (this._rendered) {
      $(this.el).append(fileView.render().el)
    //}
  }
});