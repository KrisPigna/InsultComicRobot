var express = require('express');
var router = express.Router();
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');

router.options('/upload', cors());

var upload = multer({
    dest: 'client/image/',
});

router.get('/get-image', function (req, res) {
    console.log(req.query.id);
    var path = "client/image/";
    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] == req.query.id) {
                console.log(items[i]);
                res.send({ "imageUrl": items[i] });
            }
        }
    })
});

router.delete('/delete-image', function (req, res) {
    var path = "client/image/";
    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            fs.unlink(path + items[i]);
        }
        res.send({ "message": "delete successful" })
    });
});

router.post('/upload', upload.single('file'), function (req, res, next) {
    var file = "client/image/" + req.file.originalname;
    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if (err) {
                response = {
                    message: 'Sorry, file could not be uploaded.',
                    filename: req.file.originalname
                };
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.file.filename
                };
            }
            res.send(JSON.stringify(response));
        });
    });
});

module.exports = router;