const router = require('koa-router')()
var captchapng = require('captchapng');

// router.prefix('/users')

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })


const controller = require('../controller/c-signin')

// 路由注册登录页面(页面)
router.get('/signin', controller.getSignin)
// post 登录
router.post('/signin', controller.postSignin)

// 图形验证码(页面)
router.get('/captchas', controller.getCaptchas)




module.exports = router
