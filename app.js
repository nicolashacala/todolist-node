const PORT = process.env.PORT || 8080;

var express = require('express'), 
    http = require('http'),
    ent = require('ent'),
    app = express(),
    server = http.createServer(app),
    socketio = require('socket.io').listen(server); 

var todolist = [],
    index;     


app.use(express.static('public'))

.get('/todolist', function(request, response){
    response.sendFile(__dirname + '/views/index.html');
})

.use(function(request, response, next){
    response.redirect('/todolist');
});


socketio.sockets.on('connection', function(socket){
    socket.emit('updateTask', todolist);

    socket.on('new_client', function(username) {
        username = ent.encode(username);
        socket.username = username;
    });
    
    socket.on('addTask', function(task){
       task = ent.encode(task) + ' added by ' + socket.username;
       index = todolist.length;
       todolist.push(task); 
       
       socket.broadcast.emit('addTask', {task:task, index:index});
    });
    
    socket.on('deleteTask', function(index){
        todolist.splice(index, 1);
        
        socketio.sockets.emit('updateTask', todolist);
    });
});

server.listen(PORT);