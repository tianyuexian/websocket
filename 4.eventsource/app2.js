let express = require('express');
let app = express();
app.use(express.static(__dirname));
//passThrough 通过流，它是一转换流 
const SseStream = require('ssestream');

app.get('/clock',function(req,res){
    let counter=0;
   const sseStream = new SseStream(req);
   sseStream.pipe(res);
   const pusher = setInterval(function(){
   sseStream.write({
        id:counter++,
        event:'message',
        retry:2000,
        data:new Date().toString()
    });
    //event:message\nid:0\nretry:2000\ndata:2019年3月23日17:45:51\n\n
   },1000);
   res.on('close',function(){
       clearInterval(pusher);
       sseStream.unpipe(res);
   });
});
app.listen(7777);