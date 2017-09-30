var express = require('express');
var server = express();
var http = require('http');
server.use('/', express.static(__dirname + '/public/'));
server.listen(5000);
