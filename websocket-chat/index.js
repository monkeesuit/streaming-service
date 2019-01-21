var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

unames=[];
user_count=0;
io.on('connection',function(socket) {
  user_count++;
  console.log('user connected (' + user_count + ')');

  socket.on('setUname', function(data) {
    console.log('requested uname: ', data.uname)

    unames.push(data.uname);
    socket.emit('unameAck', {uname: data.uname});
  });

  socket.on('submitMsg', function(msg) {
    console.log('heard a msg:', msg.uname, msg.msg)

    io.emit('publishMsg', msg);
  });

});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
