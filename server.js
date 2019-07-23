var express = require('express');
var server = express();
var http = require('http');
var bodyParser = require('body-parser');
server.use('/', express.static(__dirname + '/public/'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

var results = {};
var contactCalls = {};

router.get('/results', function(req, res) {
	res.json(results);
});

router.get('/results/:uid', function(req, res) {
	if (results[req.params.uid]) {
		res.json(results[req.params.uid]);
		return;
	}
	
	res.json([]);
});

router.get('/results/:uid/:action', function(req, res) {
	res.json(results[req.params.uid]); // TODO: filter by action
});

router.post('/post', function(req, res) {
	console.log('=====REQEUST BODY====');
	console.log(req.body);



	var activityId = req.body.activityId;
	var contactKey = req.body.keyValue;
	var contactCallCount = 0;
	var delay = 0;

	if (activityId && contactKey) {
		var cacheKey = activityId + '-' + contactKey;
		if (!contactCalls[cacheKey]) {
			contactCalls[cacheKey] = 1;
		} else {
			contactCalls[cacheKey] = contactCalls[cacheKey] + 1; 
		}
		contactCallCount = contactCalls[cacheKey];
	}

	var respondWith = {};

	var returnStatusCode = req.query.returnStatusCode;

	if (!returnStatusCode) {
		returnStatusCode = req.body.returnStatusCode;
	}

	if (!returnStatusCode) {
		if (req.body.inArguments && req.body.inArguments.length > 0 && req.body.inArguments[0].returnStatusCode) {
			returnStatusCode = req.body.inArguments[0].returnStatusCode;
		}
	}

	if (delay === 0) {
		if (req.query.delay && parseInt(req.query.delay) > 0) {
			delay = parseInt(req.query.delay);
		}
	}

	if (delay === 0) {
		if (req.body.inArguments && req.body.inArguments.length > 0 && req.body.inArguments[1].delay) {
			delay = parseInt(req.body.inArguments[1].delay);
		}
	}

	if (!returnStatusCode) returnStatusCode = 200;

	if (isNaN(returnStatusCode)) { 
		res.status(500).send({ "message" : "unexpected returnStatusCode"});
		return;
	}

	var uid = req.query.uid;
	
	/*
	if (!uid) {
		res.status(400).send({ "message" : "uid is required"});
		return;
	}
	*/

	if (uid && !results[uid]) { 
		results[uid] = [];
	}

	var action = req.query.action;
	if (!action) action = "unspecified";

	var now = new Date();
	var sampleOutputDate = new Date();
	var randomNumberDays = Math.floor(Math.random(0,10) * 10) + 1;
	sampleOutputDate.setDate(sampleOutputDate.getDate() + randomNumberDays);

	respondWith.action = action;
	respondWith.timestampString = now.toUTCString();
	respondWith.timestamp = now.toISOString();
	respondWith.sampleOutputDate = sampleOutputDate.toISOString();
	respondWith.returnStatusCode = returnStatusCode;
	respondWith.contactCalls = contactCallCount;

	if (uid) {
		results[uid].push(respondWith);
	}

	console.log('=======RESPONSE BODY=======');
	console.log(respondWith);
	
	if (delay <= 0) {
		res.status(returnStatusCode).send(respondWith);
	} else {
		setTimeout(function() {
			respondWith.delay = delay;
			res.status(returnStatusCode).send(respondWith);
		}, delay);
	}
});

server.use('/api', router);

server.listen(process.env.PORT || 5000);
