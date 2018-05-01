var express = require('express');
var server = express();
var http = require('http');
var bodyParser = require('body-parser')
server.use('/', express.static(__dirname + '/public/'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

var results = {
}

router.get('/results', function(req, res) {
	res.json(results);
});

router.get('/results', function(req, res) {
	res.json(results);
});

var storeResults = function(reqBody, endpoint) {
	if (!results[reqBody.definitionId]) { 
		results[reqBody.definitionId] = [];
		console.log(results);
	}
	results[reqBody.definitionId].push({
		"endpoint": endpoint,
		"timestampString" : new Date().toUTCString(), 
		"timestamp" : Date.now(),
		"body" : reqBody
	});
	console.log(results);
}

router.post('/save', function(req, res) {
	if (!req.body.definitionId) {
		res.status(400).json({ "error" : "definitionId required"});
	}
	
	storeResults(req.body, "save");
	
	res.json(req.body);
})

router.post('/validate', function(req, res) {
	if (!req.body.definitionId) {
		res.status(400).json({ "error" : "definitionId required"});
	}
	
	storeResults(req.body, "validate");
	
	res.json(req.body);
})

router.post('/publish', function(req, res) {
	if (!req.body.definitionId) {
		res.status(400).json({ "error" : "definitionId required"});
	}
	
	storeResults(req.body, "publish");
	
	res.json(req.body);
})

router.post('/execute', function(req, res) {
	if (!req.body.definitionId) {
		res.status(400).json({ "error" : "definitionId required"});
	}
	
	storeResults(req.body, "execute");
	
	res.json(req.body);
})

server.use('/api', router);

server.listen(process.env.PORT || 5000);
