var express = require('express');
var server = express();
var http = require('http');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
server.use('/', express.static(__dirname + '/public/'));
//server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
var unirest = require("unirest");

var router = express.Router();

var results = {};
var contactCalls = {};
var xforwardedfor = {};


router.use(function(req, res, next) {
	var data = "";
	req.on('data', function(chunk){ 
		data += chunk;
	});

	req.on('end', function(){
		req.rawBody = data;

		if (data) {
			
			try {
				req.body = JSON.parse(data);
				req.body.jwtEncoded = false;
			} catch(e) {
				console.log(e.toString());
				try {
					var customerKey = process.env.customerKey || 'my-signing-key';
					var decoded = jwt.decode(data, customerKey);
					req.body = decoded;
					req.body.jwtEncoded = true;
				} catch(e) {
					console.log(e.toString());
				}
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

router.get('/xforwardedfor', function(req, res) {
	res.json(xforwardedfor);
});

router.get('/xforwardedfor/clear', function(req, res) {
	xforwardedfor = {};
	res.redirect('/api/xforwardedfor');
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

router.post('/token', function(req, res) {
	console.log(req.body);
	console.log(JSON.stringify(req.headers));

	res.json({
		"access_token" : "1VRTKFVSXiIlqgyJvvWg56Z1",
		"token_type" : "bearer",
		"expires_in" : 300
	});
});

router.post('/post', function(req, res) {

	console.log('=====REQEUST BODY====');
	console.log(req.body);
	console.log('=====HEADERS====');
	console.log(JSON.stringify(req.headers));

	var activityId = req.body.activityId;
	var contactKey = req.body.keyValue;
	var contactCallCount = 0;
	var delay = 0;

	var cacheKey = '';

	if (req.headers["x-forwarded-for"]) {
		var key = req.headers["x-forwarded-for"];

		if (!xforwardedfor[key]) {
			xforwardedfor[key] = {
				count: 1,
				created: new Date().toUTCString()
			};
		} else {
			xforwardedfor[key].count = xforwardedfor[key].count + 1;
			xforwardedfor[key].updated = new Date().toUTCString();
		}
	}
	
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
	respondWith.reqip = req.ip;
	respondWith.remoteAddress = req.connection.remoteAddress;
	respondWith.xforwardedfor = req.headers["x-forwarded-for"];
	respondWith.jwtEncoded = req.body.jwtEncoded;

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

router.post('/fuelproxy', function(req, res) {
	console.log('enter fuel proxy');
	var auth = req.headers["authorization"];

	var url = req.body.proxyUrl;
	var method = req.body.method || "GET";

	/*
	Only support GET calls for now
	var postBody = req.postBody;
	*/

	console.log("requesting: " + url);
	var webreq = unirest.get(url).headers('Authorization', auth);
	
    webreq.end(function (webres) {
		if (webres.error) {
            console.log(webres.status);
            res.status(webres.status).json(webres.error);
            return;
        }

		res.json(webres.body);
	
	});
});

server.use('/api', router);

server.listen(process.env.PORT || 5002);
