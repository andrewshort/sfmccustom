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
	
	var activityObjectId;

	if (req.body.activityObjectId) {
		activityObjectId = req.body.activityObjectId;
	} else {
		activityObjectId = "unknown"
	}
	
	if (!results[activityObjectId]) { 
		results[activityObjectId] = [];
	}

	var action = req.query.action;
	if (!action) action = "unspecified";

	results[activityObjectId].push({
		"action": action,
		"timestampString" : new Date().toUTCString(), 
		"timestamp" : Date.now(),
		"body" : req.body
	});
	
	res.json(req.body);
})

server.use('/api', router);

server.listen(process.env.PORT || 5000);
