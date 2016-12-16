var http = require("http");
var io   = require("socket.io");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var $;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
 
    $ = require("jquery")(window);
});

var server = http.createServer(function(request, response) {
}).listen(10001, function () {
  console.log("10001번 채팅 서버 구동 시작...");
});


//CONNECT TO MONGODB SERVER
mongoose.connect('mongodb://192.168.0.173:27017/rscamper');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});


var ObjectId = mongoose.Schema.ObjectId;

/* Schema 선언 */
var chatLogSchema = mongoose.Schema({
	id: ObjectId,
	log: String,
	room: String,
	date: String
});
var ChatLogModel = mongoose.model('chatlog', chatLogSchema);

/* Schema 선언 */
var chatMessageSchema = mongoose.Schema({
	id: ObjectId,
	uid: String,
	msg: String,
	room: String,
	date: String
});
var ChatMsgModel = mongoose.model('chatmsg', chatMessageSchema);


var rooms = [];
var userInfo = [];
var userId;
var serverUrl = "http://14.32.66.104:";

var Now = new Date();

// 소켓 IO 객체 생성 및 구동
var socketIo = io.listen(server);

//socket 연결 완료
socketIo.on("connection", function(socket) {
	console.log("connection");
	userId = socket.id;
	
	
	// 연결 알림
	socket.emit('connection', {                  
		type : 'connected'
	});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
	
	
	// 방 접속
	socket.on('joinRoom', function(data) {
		function getRoomUserInfo(userInfo, data, asd) {
			$.ajax({
				method : 'GET',
				url    : serverUrl + '8081/app/chat/selectRoomUserList',
				data   : {
					'chatRoomInfoNo' : userInfo.room
				},
				dataType : "json",
				success  : function (result) {
					console.log("유저정보", result);
					socket.broadcast.to(userInfo.room).emit('getUserInfo', result);
				}
			})
		}
		
		
		// 연결 후 처음으로 방에 입장 했을 시 실행
		if (userInfo[socket.id] == null) {
			userInfo[socket.id] = data;
			socket.join(data.room);
			console.log("접속");
			console.log('JOIN ROOM LIST', socketIo.sockets.adapter.rooms);
			var asd = '방 접속 후 실행';
			getRoomUserInfo(userInfo[socket.id], data, asd);
		} else {
			// 방 이동 시 실행
			console.log("기존 : " + userInfo[socket.id].room);
			console.log("새로운 : " + data.room);
			socket.leave(userInfo[socket.id].room);
			userInfo[socket.id].room = data.room;
			socket.join(data.room);
			console.log("다른방");
			console.log('JOIN ROOM LIST', socketIo.sockets.adapter.rooms);
			var asd = '방 교체 후 실행';
			getRoomUserInfo(userInfo[socket.id], data, asd);
		}
		socket.emit('system', {
			message : '채팅방에 오신 것을 환영합니다.'
		});
		
		// db 입력
		var chatLog = new ChatLogModel();
		chatLog.log = data.name + '님이 접속하셨습니다.';
		chatLog.room = data.room;
		var NowTime = Now.getFullYear();
		NowTime += '-' + Now.getMonth() + 1 ;
		NowTime += '-' + Now.getDate();
		NowTime += ' ' + Now.getHours();
		NowTime += ':' + Now.getMinutes();
		NowTime += ':' + Now.getSeconds();
		chatLog.date = NowTime;
		
		chatLog.save(function(error, chatLog){
			console.log("log save 입장");
//			console.log(chatLog.log);
//			console.log(chatLog.date);
			if (error)  return console.error(err);
		});	
			
		
		// 나를 제외한 모두에게 전송
		socket.broadcast.to(data.room).emit('system', {
			roomNo : data.room,
			message : data.name + '님이 접속하셨습니다.'
		});
	});
	
	// 클라이언트로부터 메세지가 도착했을 시 실행
    socket.on('user', function(data) {
    	var send;
    	userData = userInfo[socket.id];
    	switch (data.type) {
    	case 'text' :
    		send = {
    			"type" : "text",
    			"message" : data.message,
    	        "name" : data.name,
    	        "photoUrl" : userData.photoUrl,
    	        "sendRegDate" : data.sendRegDate
    		}
    		break;
    	case 'image' :
    		send = {
    			"type" : "image",
    			"imgUrl" : data.imgUrl,
    	        "name" : data.name,
    	        "photoUrl" : userData.photoUrl,
    	        "sendRegDate" : data.sendRegDate
    		}
    		break;
    	}
    	
        socket.broadcast.to(userData.room).emit('message', send);
        console.log("in");
        
        
    	// db 입력
		var chatMsg = new ChatMsgModel();
		chatMsg.uid = userInfo[socket.id].uid;
		chatMsg.msg = data.message;
		chatMsg.room = data.room;
		var NowTime = Now.getFullYear();
		NowTime += '-' + Now.getMonth() + 1 ;
		NowTime += '-' + Now.getDate();
		NowTime += ' ' + Now.getHours();
		NowTime += ':' + Now.getMinutes();
		NowTime += ':' + Now.getSeconds();
		chatMsg.date = NowTime;
		
		chatMsg.save(function(error, chatMsg){
			if (error)  return console.error(err);
		});	
    });
    
    
    // 유저가 퇴장할 때 실행 
    // db에 있는 유저 목록 삭제 > 방에 유저 수를 체크 > 0일 경우 방 삭제
    // 방 인원이 0보다 큰 경우에는 db에서 유저 정보를 새롭게 가져와서 클라이언트로 보냄
    socket.on('outRoom', function (data) {
    	if (userInfo[socket.id] != undefined) {
    		console.log("유저정보 : ",userInfo[socket.id]);
    		$.ajax({
        		method  : 'GET',
        		url     : serverUrl + '8081/app/chat/delChatUser',
        		data    : {
        			'uid' : userInfo[socket.id].uid
        		},
        		success : function () {
        			var roomLength = socketIo.sockets.adapter.rooms[userInfo[socket.id].room].length - 1;
            		if (roomLength == 0) {
            			$.ajax({
            				method : 'GET',
            				url    : serverUrl + '8081/app/chat/delRoom',
            				data   : {
            					'roomNo' : userInfo[socket.id].room,
            					'no'     : userInfo[socket.id].areacode
            				},
            				dataType : "json",
            				success  : function (result) {
            					console.log('방정보',result);
            					socket.emit('roomList',result);
            				}
            			})
            		} else if (roomLength > 0) {
            			$.ajax({
            				method : 'GET',
            				url    : serverUrl + '8081/app/chat/selectRoomUserList',
            				data   : {
            					'chatRoomInfoNo' : userInfo[socket.id].room
            				},
            				dataType : "json",
            				success  : function (result) {
            					console.log("다른 유저가 방에서 나갔을 때",result);
            					socket.broadcast.to(userInfo[socket.id].room).emit('getUserInfo', result);
            					socket.emit('outRoomUser');
            				}
            			})
            		}
        		}
        	})
    		
    		// db 입력
    		var chatLog = new ChatLogModel();
    		chatLog.log = data.name + '님이 퇴장하셨습니다.';
    		chatLog.room = data.room;
    		var NowTime = Now.getFullYear();
    		NowTime += '-' + Now.getMonth() + 1 ;
    		NowTime += '-' + Now.getDate();
    		NowTime += ' ' + Now.getHours();
    		NowTime += ':' + Now.getMinutes();
    		NowTime += ':' + Now.getSeconds();
    		chatLog.date = NowTime;
    		
    		chatLog.save(function(error, chatLog){
    			console.log("log save 퇴장");
    			console.log(chatLog.log);
    			console.log(chatLog.date);
    			if (error)  return console.error(err);
    		});
    		
    		socket.broadcast.to(userInfo[socket.id].room).emit('outMsg', {
    			name : userInfo[socket.id].name,
    			roomNo : userInfo[socket.id].room,
    			message : userInfo[socket.id].name + "님이 퇴장하였습니다."
    		});
    	}
	});
    
    
    // 방에서 나갈 때 클라이언트 에서 'outRoom' emit 후 'roomList'를 'on' 그리고 'on' 메서드 안에서 'exit' emit 실행 
    socket.on('exit',function (data) {
    	socket.leave();
		socket.disconnect();
		console.log("나감");
    });
});

