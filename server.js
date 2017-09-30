var express = require('express');
var server = express();
var http = require('http');
server.use('/', express.static(__dirname + '/public/'));
server.listen(process.env.PORT || 5000);
