var socket = io.connect(window.location.host);


var username = prompt('What\'s your username?');
socket.emit('new_client', username);
document.title = username + ' - ' + document.title;

socket.on('updateTask', function(todolist) {
    $('#todolist').empty();
    todolist.forEach(function(task, index) {
        insertTask(task, index);
    });
});

$('#todolistForm').submit(function (){
    var task = $('#task').val();
    socket.emit('addTask', task);
    task += ' added by ' +username;
    var index = $('#todolist li').length;
    insertTask(task, index);
    $('#task').val('').focus();
    return false;
});

socket.on('addTask', function(data) {
    insertTask(data.task, data.index);
});

function insertTask(task, index){
    $('#todolist').append('<li><a class="delete" href="#" data-index="' + index + '">✘</a> ' + task  + '</li>');
}

$('body').on('click', '.delete', function()
{
    socket.emit('deleteTask', $(this).data('index'));
});