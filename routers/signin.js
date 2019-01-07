const router = require("koa-router")();
// var captchapng = require("captchapng");

const controller = require("../controller/c-signin");

// 路由注册登录页面(页面)
router.get("/signin", controller.getSignin);
// post 登录
router.post("/signin", controller.postSignin);

// 图形验证码(页面)
router.get("/captchas", controller.getCaptchas);

// 找回密码
router.get("/forgetpass", controller.getforgetPass);

//post 找回密码
router.post("/forgetpass", controller.postforgetPass);

// forgetPassword

module.exports = router;
