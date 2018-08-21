const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')

exports.getSignup = async ctx => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session,
    })
}
exports.postSignup = async ctx => {
    let { name, password, repeatpass, avator } = ctx.request.body
    console.log(typeof password)
    await userModel.findDataCountByName(name)
        .then(async (result) => {
            console.log(result)
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '用户存在'
                };
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: '两次输入的密码不一致'
                };
            } else if(avator && avator.trim() === ''){
                ctx.body = {
                    code: 500,
                    message: '请上传头像'
                };
            } else {
                let base64Data = avator.replace(/^data:image\/\w+;base64,/, ""),
                    dataBuffer = new Buffer(base64Data, 'base64'),
                    getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
                    upload = await new Promise((reslove, reject) => {
                        fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
                            if (err) {
                                throw err;
                                reject(false)
                            };
                            reslove(true)
                            console.log('头像上传成功')
                        });
                    });
                // console.log('upload', upload)
                if (upload) {
                    await userModel.insertData([name, md5(password), getName + '.png', moment().format('YYYY-MM-DD HH:mm:ss')])
                        .then(res => {
                            console.log('注册成功', res)
                            //注册成功
                            ctx.body = {
                                code: 200,
                                message: '注册成功'
                            };
                        })
                } else {
                    console.log('头像上传失败')
                    ctx.body = {
                        code: 500,
                        message: '头像上传失败'
                    }
                }
            }
        })
}