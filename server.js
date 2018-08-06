var express = require('express');
var server = express();
var http = require('http');
var bodyParser = require('body-parser')
server.use('/', express.static(__dirname + '/public/'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

var results = {}

router.get('/results', function(req, res) {
	res.json(results);
});

router.get('/results/:uid', function(req, res) {
	res.json(results[req.params.uid]);
});

router.get('/results/:uid/:action', function(req, res) {
	res.json(results[req.params.uid]); // TODO: filter by action
});

router.post('/post', function(req, res) {
	
	var returnStatusCode = req.query.returnStatusCode;
	if (!returnStatusCode) returnStatusCode = 200;

	if (isNaN(returnStatusCode)) { 
		res.status(500).send({ "message" : "unexpected returnStatusCode"});
		return;
	}

	var uid = req.query.uid;
	if (!uid) {
		res.status(400).send({ "message" : "uid is required"})
		return;
	}

	if (!results[uid]) { 
		results[uid] = [];
	}

	var action = req.query.action;
	if (!action) action = "unspecified";

	var now = new Date();
	var sampleOutputDate = new Date();
	var randomNumberDays = Math.floor(Math.random(0,10) * 10) + 1;
	sampleOutputDate.setDate(sampleOutputDate.getDate() + randomNumberDays);

	results[uid].push({
		"action": action,
		"timestampString" : now.toUTCString(), 
		"timestamp" : now.toISOString(),
		"sampleOutputDate" : sampleOutputDate.toISOString(),
		"body" : req.body
	});
	
	if (parseInt(returnStatusCode) <= 299) {
		res.status(returnStatusCode).send({
			"action": action,
			"timestampString" : now.toUTCString(), 
			"timestamp" : now.toISOString(),
			"sampleOutputDate" : sampleOutputDate.toISOString()
		});
	} else {
		res.status(returnStatusCode).send({ "message" : "non successful"})
	}
})

server.use('/api', router);

server.listen(process.env.PORT || 5000);
