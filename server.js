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

router.get('/results/:activityObjectId', function(req, res) {
	res.json(results[req.params.activityObjectId]);
});

router.get('/results/:activityObjectId/:action', function(req, res) {
	res.json(results[req.params.activityObjectId]); // TODO: filter by action
});

router.post('/post', function(req, res) {
	
	var activityObjectID;

	var returnStatusCode = req.query.returnStatusCode;
	if (!returnStatusCode) returnStatusCode = 200;

	if (isNaN(returnStatusCode)) { 
		res.status(500).send({ "message" : "unexpected returnStatusCode"});
		return;
	}

	if (req.body.activityObjectID) {
		activityObjectID = req.body.activityObjectID;
	} else {
		activityObjectID = "unknown"
	}
	
	if (!results[activityObjectID]) { 
		results[activityObjectID] = [];
	}

	var action = req.query.action;
	if (!action) action = "unspecified";

	results[activityObjectID].push({
		"action": action,
		"timestampString" : new Date().toUTCString(), 
		"timestamp" : Date.now(),
		"body" : req.body
	});
	
	if (parseInt(returnStatusCode) <= 299) {
		res.status(returnStatusCode).send(req.body)
	} else {
		res.status(returnStatusCode).send({ "message" : "non successful"})
	}
})

server.use('/api', router);

server.listen(process.env.PORT || 5000);
