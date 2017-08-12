var Koa=require('koa');
var path=require('path')
var bodyParser = require('koa-bodyparser');
var ejs=require('ejs');
var session = require('koa-session-minimal');
var MysqlStore = require('koa-mysql-session');
var config = require('./config/default.js');
var router=require('koa-router')
var views = require('koa-views')
var koaStatic = require('koa-static')
var app=new Koa()


// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(bodyParser())

//  路由
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())


app.listen(3000)
console.log(`listening on port ${config.port}`)
