const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const logger = require('koa-logger')
const path = require('path')
const ejs = require('ejs')
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const staticCache = require('koa-static-cache')




// const index = require('./routers/posts')
// const users = require('./routers/users')

// error handler
onerror(app)

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

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  formLimit: '1mb'
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {

  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

//  路由

app.use(require('./routers/users.js').routes())
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signout.js').routes())
app.use(require('./routers/posts.js').routes())



//使用模块
// app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
//     // ueditor 客户发起上传图片请求
//     if (req.query.action === 'uploadimage') {
//         var foo = req.ueditor;
//         var imgname = req.ueditor.filename;
//         var img_url = '/images/ueditor/';
//         res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
//         res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
//     }
//     //  客户端发起图片列表请求
//     else if (req.query.action === 'listimage') {
//         var dir_url = '/images/ueditor/';
//         res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
//     }
//     // 客户端发起其它请求
//     else {

//         res.setHeader('Content-Type', 'application/json');
//         res.redirect('/ueditor/nodejs/config.json');
//     }
// })());


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
