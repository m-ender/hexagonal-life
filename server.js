var express = require('express');
var morgan = require('morgan');

var server = express();

server.use(morgan('combined'));
server.use(express.static(__dirname + '/public'));

var port = 1618;

server.listen(port);
console.log('Listening on port ' + port);
