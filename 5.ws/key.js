let key = 'O/SldTn2Th7GfsD07IxrwQ==';
let accept = 'H8BlFmSUnXVpM4+scTXjZIwFjzs=';
let CODE = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
let crypto = require('crypto');
let result = crypto.createHash('sha1').update(key+CODE).digest('base64');
console.log(result);

console.log(Math.pow(2,16)-1);//64K
console.log((Math.pow(2,64)-1)/1024/1024/1024);//18446744073709552000
//进制本质 上是什么
console.log(0b1111 == 15);
//聊天 弹幕 股票 客服系统 游戏  canvas版的你画我猜的小游戏 