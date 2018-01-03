const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
// 注册页面
router.get('/signup', async(ctx, next) => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session,
    })
})
    // post 注册
router.post('/signup', async(ctx, next) => {
    console.log(ctx.request.body)
    let user = {
        name: ctx.request.body.name,
        pass: ctx.request.body.password,
        repeatpass: ctx.request.body.repeatpass
    }
    await userModel.findDataByName(user.name)
        .then(async (result) => {
            console.log(result)
            if (result.length) {
                try {
                    throw Error('用户已经存在')
                } catch (error) {
                    //处理err
                    console.log(error)
                }
                // 用户存在
                ctx.body = {
                    data: 1
                };;
                
            } else if (user.pass !== user.repeatpass || user.pass === '') {
                ctx.body = {
                    data: 2
                };
            } else {
                // ctx.session.user=ctx.request.body.name               
                await userModel.insertData([user.name, md5(user.pass)])
                    .then(res=>{
                        console.log('注册成功',res)
                        //注册成功
                        ctx.body = {
                            data: 3
                        };
                    })
            }
        })
})
module.exports = router