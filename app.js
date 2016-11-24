var http = require("http");
var io   = require("socket.io");

var server = http.createServer(function(request, response) {
}).listen(10001, function () {
  console.log("서버 구동 시작...");
});


var rooms = [];


// 소켓 IO 객체 생성 및 구동
var socketIo = io.listen(server);

//socket 연결 완료
socketIo.on("connection", function(socket) {
	console.log("connection");
	
	// 연결 알림
	socket.emit('connection', {
		type : 'connected'
	});
	
	
	socket.on('connection', function(data) {
		console.log(data.type);
		console.log(data.name);
		console.log(data.room);
		
		// 방 접속
		if(data.type == 'join') {
			console.log("join");
			socket.join(data.room);
			
			socket.room = data.room;
			
			// 나에게 전송
			socket.emit('system', {
                message : '채팅방에 오신 것을 환영합니다.',
                roomNo : data.room
            });
			
			// 나를 제외한 모두에게 전송
            socket.broadcast.to(data.room).emit('system', {
                message : data.name + '님이 접속하셨습니다.',
                roomNo : data.room
            });
		} 
	});
	
	
    socket.on('user', function(data) {
    	console.log("in user");
    	console.log(socket.room);
        socket.broadcast.to(socket.room).emit('message', data);
    });
    
    socket.on('out', function(data) {
    	console.log("in out");
    	console.log(data.name);
    	console.log(socket.room);
    	socket.leave(socket.room);
        socket.broadcast.to(socket.room).emit('out', {
        	message : data.name + '님이 퇴장하셨습니다.'
        });
    });
});


