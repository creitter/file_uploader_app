var fileCollection = new FileCollection();

var view = new UploadView( {el: $("#uploader"), collection: fileCollection} );
view.render();

var fileCollectionView = new FileCollectionView({el: $('#uploaded_files'), collection: fileCollection});
fileCollectionView.render();