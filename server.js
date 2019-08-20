var express = require('express');
var server = express();
var http = require('http');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
server.use('/', express.static(__dirname + '/public/'));
//server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

var results = {};
var contactCalls = {};

router.use(function(req, res, next) {
	var data = "";
	req.on('data', function(chunk){ 
		data += chunk;
	});

	req.on('end', function(){
		console.log('data from middleware');
		console.log(data);
		req.rawBody = data;

		
		if (data && data.length == 256) {
			console.log('parsing data from middleware');
			req.body = JSON.parse(jwt.decode(data, ''));

		} else {
			console.log('JSON parse raw data');
			if (data) {
				try {
					req.body = JSON.parse(data);
				} catch(e) {}
			}
		}
		
		
		next();
	});
});

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

router.get('/contactcalls', function(req, res) {
	res.json(contactCalls);
});

router.get('/contactcalls/clear', function(req, res) {
	contactCalls = {};
	res.redirect('/api/contactcalls');
});

router.get('/results/:uid/:action', function(req, res) {
	res.json(results[req.params.uid]); // TODO: filter by action
});

router.post('/post', function(req, res) {

	console.log('---- RAW BODY-----');
	console.log(req.rawBody);

	console.log('=====REQEUST BODY====');
	console.log(req.body);



	var activityId = req.body.activityId;
	var contactKey = req.body.keyValue;
	var contactCallCount = 0;
	var delay = 0;

	var cacheKey = '';

	if (activityId && contactKey) {
		cacheKey = activityId + '-' + contactKey;
		if (!contactCalls[cacheKey]) {
			contactCalls[cacheKey] = {
				count: 1,
				cacheCreated: new Date().toUTCString(),
				callItems: []
			};
		} else {
			contactCalls[cacheKey].count = contactCalls[cacheKey].count + 1;
			contactCalls[cacheKey].cacheUpdated = new Date().toUTCString();
		}

		

		contactCallCount = contactCalls[cacheKey].count;
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

	// always succeed after first try for now
	if (contactCallCount > 5) {
		returnStatusCode = 200;
		delay = 0;
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
	respondWith.delay = delay;
	respondWith.branchResult = 'branchResult-1';

	if (cacheKey && cacheKey.endsWith('0')) {
		respondWith.branchResult = 'branchResult-2';
		//returnStatusCode = 500;
		//respondWith.returnStatusCode = returnStatusCode;
		//delete respondWith.sampleOutputDate;
	}

	if (uid) {
		results[uid].push(respondWith);
	}

	
	
	if (delay <= 0) {
		console.log('=======RESPONSE BODY=======');
		console.log(respondWith);

		if (cacheKey && contactCalls[cacheKey]) {
			contactCalls[cacheKey].lastResponse = respondWith;
			contactCalls[cacheKey].callItems.push(respondWith);
		}
		res.status(returnStatusCode).send(respondWith);
	} else {
		setTimeout(function() {
			console.log('=======RESPONSE BODY=======');
			respondWith.endResponse = new Date().toISOString();
			console.log(respondWith);
			if (cacheKey && contactCalls[cacheKey]) {
				contactCalls[cacheKey].lastResponse = respondWith;
				contactCalls[cacheKey].callItems.push(respondWith);
			}
			res.status(returnStatusCode).send(respondWith);
		}, delay);
	}
});

server.use('/api', router);

server.listen(process.env.PORT || 5000);
