var express = require('express');
var http = require('http');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require("path");

var upload = require('./routes/upload');

var port = 3000;

var app = express();
app.use(cors());

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'client')));

app.use('/api', upload);

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'client')});
});

app.set('port', port);

const server = http.createServer(app);

server.listen(process.env.PORT || port, function() {
    console.log("Server started on port " + port);
});