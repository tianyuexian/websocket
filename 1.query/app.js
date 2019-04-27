let express = require('express');
let app = express();
// http://localhost:8000/
app.use(express.static(__dirname));
app.get('/clock',function(req,res){
   res.send(new Date().toLocaleString())
});
app.listen(8000);