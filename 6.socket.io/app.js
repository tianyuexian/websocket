let express = require('express');
let {Message} = require('./db');
let app = express();
app.use(express.static(__dirname));
//app.listen(3000);
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let SYSTEM = '系统';
let sockets = {};
//监听客户端的连接事件,当客户端连接上来后，执行回调函数
io.on('connection',async function(socket){
  let username;
  let rooms=[];//代表此客户端进入的所有房间
  socket.on('getAllMessages',async function(){
    let messages = await Message.find().sort({createAt:-1}).limit(10);
    messages.reverse();
    socket.emit('allMessages',messages);
  });
  socket.on('join',function(roomName){
    let index = rooms.indexOf(roomName);
    if(index == -1){
        rooms.push(roomName);
        socket.join(roomName);
        socket.emit('joined',roomName);
    }
  });
  socket.on('leave',function(roomName){
    let index = rooms.indexOf(roomName);
    if(index!=-1){
        rooms.splice(index,1);
        socket.leave(roomName);
        socket.emit('leaved',roomName);
    }
  });
  socket.on('message',async function(content){
    if(username){
        let result = content.match(/@([^ ]+) (.+)/);
        if(result){//如果匹配则是私聊
            let toUser = result[1];
            let toContent = result[2];
            let toSocket = sockets[toUser];
            toSocket&&toSocket.emit('message',getMsg(toContent,username));
        }else{//否则是公聊
             //如果在大厅说话，则所有的人都能听的到，包括其它大厅的人和所有房间的人
             let savedMessage = await Message.create(getMsg(content,username));
             console.log(rooms);
            if(rooms.length>0){
                //循环所有的房间
                rooms.forEach(room=>{
                    console.log(room);
                    io.in(room).emit('message',savedMessage);
                });
            }else{
                io.emit('message',savedMessage);
            }
        }
    }else{
        //如果说用户名没有设置过的话
        let oldSocket = sockets[content];
        if(oldSocket){
            socket.emit('message',getMsg(`${content}已经被占用,请换一个用户名吧!`));
        }else{
            username = content;//把这个消息的内容设置为当前用户的用户名
            //把用户名和对应的socket对象进行关联
            sockets[username] = socket;
            //告诉所有的客户端有新的用户加入了聊天室
            socket.broadcast.emit('message',getMsg(`${username}加入聊天室`));
        }   
    } 
  });
});
server.listen(3000);
function getMsg(content,username=SYSTEM){
  return {username,content,createAt:new Date()};
}
/* Socket.prototype.send = function(){
    var args = Array.from(arguments);// ['hello']
    args.unshift('message');// ['message','hello']
    socket.emit('message','hello');
}; */

