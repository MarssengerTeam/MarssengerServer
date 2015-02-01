var express = require('express');
var router = express.Router();
var path = require('path');

router.post('/upload', function (req, res){
    var form = new formidable.IncomingForm();
    form.hash = 'md5';
    form.multiples = true;
 
    function parseForm(err) {
        if (err) console.error(err);
        res.redirect('/');
    }
 
    function formEnd() {
        var uploads = 'public/uploads';
        this.openedFiles.forEach(function(file) {
            var name = file.hash + '.' + (file.name.split('.').slice(-1)[0]).toLowerCase();
 
            var src  = file.path;
            var dest = path.join(uploads, name);
 
            fs.copy(src, dest, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("[INFO] Uploaded: %s as %s", file.name, name);
                }
            });
        });
    }
 
    form.parse(req, parseForm);
    form.on('end', formEnd);
});

// Show the upload form	
router.get('/', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  var form = '<form action="/files/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  res.end(form); 
}); 

module.exports = router;