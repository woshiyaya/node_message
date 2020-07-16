// 三步开启服务器
const http = require('http');
const server = http.createServer();
server.listen(3000,()=>{
  console.log('服务开启啦')
})

const fs = require('fs')
// 处理浏览器的请求
server.on('request',(req,res)=>{


  // *************获取留言************
   if(req.url === '/getMsg' && req.method === 'GET'){
    // 读取json文件
    // 将读取的结果响应给浏览器
    let data = require('./msg');
    // 告诉浏览器返回的是什么
    res.writeHead(200,{
      'Content-type':'application/json;charset=utf-8'
    })
      res.end(JSON.stringify(data));
  }


  // ************添加留言*****************
   if(req.url === '/addMsg' && req.method === 'POST'){
    //  添加留言的时候，接口应该做什么？
    // 1.接收浏览器提交过来的数据
    // 1.1定义一个空的字符串，用来保存提交过来的数据
      var str = '';
    // 1.2req的data事件，当接收到浏览器提交的数据，就会触发这个事件
      req.on('data',(chunk)=>{
        // chunk接收的数据
        str += chunk;
      });
    // 1.3注册req的end事件，当完全接收完浏览器的数据时，触发这个事件
      req.on('end',()=>{
         // console.log(str)
         const querystring =require('querystring');
         let newMsg = querystring.parse(str);//得到一个js的对象
         // 2.将数据放到msg.json中
         // 2.1读取所有数据
         let all = require('./msg');//得到一个js数组
         // 2.2把新数据填进去
         all.push(newMsg);
         // 2.3所有的数据重新保存
         fs.writeFile('./msg.json',JSON.stringify(all),(err)=>{
           if (err) throw err;
          // 3.做出响应
          res.end(JSON.stringify({code:200,msg:'添加成功'}));
         })
        
      })
   
   return;
   }








   fs.access('./message'+req.url,(err)=>{
       if(err){
         res.writeHead(404,{
           'Content-type':'text/html;charset=utf-8'
         });
         res.end('不存在')
       }else{
         fs.readFile('./message'+req.url, (err,data)=>{
            if(err) throw err;
            res.end(data);
         })
       }
   })
})