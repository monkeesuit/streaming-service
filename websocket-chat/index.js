var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');

});


var user_count = 0;
var users = [];
io.on('connection', function(socket){
  user_count++;
  console.log('a user connected');
  console.log(user_count + ' People Watching');

  io.emit('watchers', user_count);

  socket.on('setUsername', function(uname){
    console.log(uname + ' was requested');

    if(users.indexOf(uname) > -1) {
      console.log(uname + ' bad');
      socket.emit('usernamebad', 'Username is taken!');
    } else {
      console.log(uname + ' ok');
      users.push(uname);
      socket.emit('usernameok', uname);
    }

  });

  socket.on('msg', function(data){
    console.log('msg-' + data.uname);

    io.emit('msg', data);
  });

  socket.on('disconnect', function(){
    user_count--;
    console.log('user disconnected');
    console.log(user_count + ' People Watching');
  });

});



http.listen(3000, function(){ console.log('listening on *:3000'); });
