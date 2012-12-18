// The view for the Upload File section 
var view = new UploadView( {el: $("#uploader")} );

var fileTemp = new UploadedFile ({
  location: "/uploads/",
   filename: "test.jpg",
   words: 10,
   lines: 40,
   top_5: [],
   done: false
});

var uploadedFiles = new UploadedFiles;
 
uploadedFiles.push(fileTemp);

var fileCollectionView = new FileCollectionView({
  collection : uploadedFiles,
  el : $('ul.uploaded_files')[0]
});

fileCollectionView.render();

var uploadView2 = new UploadView2({model : fileTemp});

var renderedUploadFileElement = uploadView2.render().el;

console.log (renderedUploadFileElement)