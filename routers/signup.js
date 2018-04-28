const router = require('koa-router')();
const controller = require('../controller/c-signup')

// 注册页面
router.get('/signup', controller.getSignup)
// post 注册
router.post('/signup', controller.postSignup)

module.exports = router