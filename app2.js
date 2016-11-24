var http = require("http");
var io   = require("socket.io");

var server = http.createServer(function(request, response) {
}).listen(10001, function () {
  console.log("서버 구동 시작...");
});


var rooms = [];
var userInfo = [];

// 소켓 IO 객체 생성 및 구동
var socketIo = io.listen(server);

//socket 연결 완료
socketIo.on("connection", function(socket) {
	console.log("connection");
	var userId = socket.id;
	
	// 연결 알림
	socket.emit('connection', {
		type : 'connected'
	});
	
	// 방 접속
	socket.on('joinRoom', function(data){
		userInfo[data.uid] = data;
		socket.join(data.room);
		console.log("접속");
		console.log(data.uid);
		console.log(data.name);
		console.log(data.room);
		console.log(data.photoUrl);
		console.log('JOIN ROOM LIST', socketIo.sockets.adapter.rooms);
		socket.emit('system', {
			message : '채팅방에 오신 것을 환영합니다.',
            roomNo : data.room
		});
		
		// 나를 제외한 모두에게 전송
		socket.broadcast.to(data.room).emit('system', {
			message : data.name + '님이 접속하셨습니다.',
            roomNo : data.room
		});
	});
	

	
    socket.on('user', function(data) {
    	var send;
    	var userData = userInfo[data.uid];
    	console.log(userInfo[data.uid]);

    	switch (data.type) {
    	case 'text' :
    		send = {
    			"type" : "text",
    			"message" : data.message,
    	        "name" : data.name,
    	        "photoUrl" : data.photoUrl
    		}
    		console.log(data.uid);
    		console.log(data.type);
			console.log(data.message);
			console.log(data.name);
			console.log(data.photoUrl);
    		
    		break;
    	case 'image' :
    		send = {
    			"type" : "image",
    			"imgUrl" : data.imgUrl,
    	        "name" : data.name,
    	        "photoUrl" : data.photoUrl
    		}
    		console.log(data.type);
			console.log(data.imgUrl);
			console.log(data.name);
			console.log(data.photoUrl);
    		break;
    	}
//    	console.dir(socketIo.sockets.adapter.rooms[userData.room]);
        //socket.broadcast.to(userData.room).emit('message', send);
    });
    
    socket.on('out', function(data) {
    	console.log("in out");
        socket.broadcast.to('asd').emit('out', {
        	message : data.name + '님이 퇴장하셨습니다.'
        });
    });
    
    
    socket.on('exit', function () {
    	socket.leave();
		socket.disconnect();
	});
});


