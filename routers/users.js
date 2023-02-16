const router = require('koa-router')()

// router.prefix('/users')

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })


const controller = require('../controller/c-signup')

// 注册页面
router.get('/signup', controller.getSignup)
// post 注册
router.post('/signup', controller.postSignup)


//会员列表
router.get('/userlist', controller.getUserlist)
//会员分页数据
router.post('/userlist/page', controller.postUserlist)

//账号激活
router.get('/active', controller.getUseractive)


module.exports = router
