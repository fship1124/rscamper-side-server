var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app);
// p1으로 들어오는건 router로 위임한다.
app.use('/p1', p1);

var p2 = require('./routes/p2')(app);
app.use('/p2', p2);

app.listen(3000, function() {
	console.log('connected');
});

