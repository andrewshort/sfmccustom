var express = require('express');
var server = express();
var http = require('http');
server.use('/', express.static(__dirname + '/public/'));

var router = express.Router();

router.post('/save', function(req, res) {
	res.json({});
})

router.post('/validate', function(req, res) {
	res.json({});
})

router.post('/publish', function(req, res) {
	res.json({});
})

router.post('/execute', function(req, res) {
	res.json({});
})

server.use('/api', router);

server.listen(process.env.PORT || 5000);
