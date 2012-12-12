var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

var UPLOAD_DIRECTORY = "/uploads/";

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

/* Not sure why I couldn't get routes.browse to work. I'll look into it later. */
app.get('/browse', function(req, res) {
  res.render('browse', { title: 'Browse files uploaded', data: data });
});

app.post('/file-upload', function(req, res, next) {
  fs.rename(req.files.textfile.path, "./public" + UPLOAD_DIRECTORY + req.files.textfile.name, function(err) {
    if (err) {
      console.log("err " + err)
      fs.unlink("./public/uploads/" + req.files.textfile.name);
      fs.rename(req.files.textfile.path, "uploads/" + req.files.textfile.name);
    }
  });

  var exec = require('child_process').exec;
  exec("wc -lw " + "./public/" + UPLOAD_DIRECTORY + req.files.textfile.name, function (error, results) {
    //convert the string into a format we can split up and assume the order for the lines and words count
    var regexp = new RegExp("[ ]+","g");
    results = results.replace(regexp,",");
    results = results.slice(1)
    var resultsAry = results.split(",");
    // This might be up for discussion, but since wc only counts newlines, I'm adding 1 because I count blank lines as lines too
    var lines = parseInt(resultsAry[0]) + 1
    output = {lines: lines,
            words: resultsAry[1],
            location: UPLOAD_DIRECTORY,
            filename: req.files.textfile.name}

    //TODO: Corinne - Saturday project
    /* I feel like there is a better way to store/handle this.  I don't want to look up the entire folder directory again
    and gather the information considering we already have it.  However, this can get large so maybe storing it in a database
    reference/lookup? or maybe clarify the request for the browse list page. */
    data.push(output);

    res.send(output);
  });
});


var data = [];

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
