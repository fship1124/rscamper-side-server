var http = require("http");
var io = require("socket.io");

var server = http.createServer(function(request, response) {
}).listen(10002, function() {
	console.log("10002번 포트 서버 구동 시작...");
});


// 소켓 IO 객체 생성 및 구동
var socketIo = io.listen(server);

var uidArr = [];

socketIo.on("connection", function (socket) {
	console.log("notis socket connection");
	
	socket.on("notis", function(userUid) {
		console.log("접속한 회원 정보 : " + userUid, socket.id);
		// 입력한 아이디와 socket.id를 연결
		uidArr[userUid] = socket.id;
	});
	

	socket.on("commentInfo", function(data) {
		console.log("in commentInfo");
		console.log(data.type);
		console.log(data.recvId);
		console.log(data.count);
		
		var message = "알림이 도착 했습니다.";
		
		switch (data.type) {
		case "comment" :
			message = "댓글이 달렸습니다.";
			break;
		case "like" :
			message = "추천을 받았습니다.";
			break;
		case "bookmark" :
			message = "북마크를 받았습니다.";
			break;
		case "message" :
			message = "쪽지를 받았습니다.";
			break;
		}
		
		// io.to("전송할 소켓 아이디").emit
		socketIo.to(uidArr[data.recvId]).emit("notification", {
			message : message,
			count : Number(data.count) + 1
		});
	});
});


