var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs   = require('fs-extra');

router.post('/upload', function (req, res){
	var db = req.db;
    var form = new formidable.IncomingForm();
    form.hash = 'md5';
    form.multiples = true;
 
    function parseForm(err) {
        if (err) console.error(err);
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
					db.collection('files').insert({name : file.name, text : file.name, link : name}, {upsert: true }, function(err, result){
						res.send(result);
					});
					//res.redirect('/uploads/' + name);
                }
            });
        });
    }
 
    form.parse(req, parseForm);
    form.on('end', formEnd);
});



module.exports = router;