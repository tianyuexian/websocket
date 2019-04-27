let express = require('express');
let app = express();
// http://localhost:8000/

app.use(express.static(__dirname));
app.get('/clock',function(req,res){
  res.header('Content-Type','text/event-stream');
  let counter = 0;
  let $timer = setInterval(function(){
    res.write(`id:${counter++}\nevent:message\ndata:${new Date().toLocaleString()}\n\n`);
  },1000);
  res.on('close',function(){
     clearInterval($timer);
  });
});
app.listen(7777);