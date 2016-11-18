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
                message : '채팅방에 오신 것을 환영합니다.'
            });
			
			// 나를 제외한 모두에게 전송
            socket.broadcast.to(data.room).emit('system', {
                message : data.name + '님이 접속하셨습니다.'
            });
		} 
//		else if(data.type == 'out') {
//			console.log("out");
//			socket.broadcast.to(data.room).emit('system', {
//				message : data.name + '님이 퇴장하셨습니다.'
//			});
//		}
	});
	
// socket.on('room', function(data){
//		console.log("in room");
//		console.log(data.room);
//		
//		socket.room = data.room;
//	});
	
    socket.on('user', function(data) {
    	console.log("in user");
    	console.log(socket.room);
        socket.broadcast.to(socket.room).emit('message', data);
//        socket.sockets(m).emit('message', data);
    });
    
    socket.on('out', function(data) {
    	console.log("in out");
    	console.log(data.name);
    	console.log(socket.room);
        socket.broadcast.to(socket.room).emit('out', {
        	message : data.name + '님이 퇴장하셨습니다.'
        });
    });
});





/*
 * socketIo.on("connection", function (socket) { socket.on("msg", function
 * (data) { console.log("received"); console.log(data.room);
 * console.log(data.message);
 * 
 * socket.join(data.room);
 * 
 * socket.on('room', data.room, function() { console.log("in room");
 * 
 * var room = data.room;
 * 
 * if (rooms[room] == undefined) { console.log('room create :' + room);
 * rooms[room] = new Object(); rooms[room].socket_ids = new Object(); }
 *  // 개별통신 : 데이터를 보낸 사용자에게만 보내기 socket.emit("msg", '채팅방에 오신 것을 환영합니다.');
 * 
 * });
 * 
 * 
 * console.log("전체 전송 : " + data.message);
 * 
 *  // 접속한 사용자 모두에게 데이터 전송 : 전체 통신일 경우 io.sockets.emit를 사용함
 * socketIo.sockets.emit("msg", data.message);
 *  // 나를 제외한 접속자 모두에게 : 전체 통신일 경우 socket.broadcast.emit를 사용함 //
 * socket.broadcast.emit("msg", data); }); });
 */