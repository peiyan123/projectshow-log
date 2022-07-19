const express = require('express')
const app = express()

app.use(express.static('dist'))
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var detailRouter = require("./controller/detail");
app.use('/', detailRouter);
//设置跨域访问
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  // //允许的header类型
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  // //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 可以带cookies
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
})
app.listen(3001, function() {
	console.log('3001服务已启动')
})