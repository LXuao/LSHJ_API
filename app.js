// 搭建服务

const express = require('express');
let app = new express();
const path = require('path');
const bodyParser = require('body-parser'); // 中间件(接收以post方式提交的参数))
// 解析成json格式
app.use(bodyParser.json());
//开放静态资源
app.use(express.static('static'))

const apiRouter = require('./router/api');
app.use('/api', apiRouter);


// 跨域
app.all('*', function (req, res, next) {    
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// 设置监听端口号
app.listen(3000, () => {
    console.log('3000端口在运行')
})
