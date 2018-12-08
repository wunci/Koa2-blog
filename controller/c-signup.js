const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')

var sleep = require('sleep');

var send = require('../lib/mail-test');

exports.getSignup = async ctx => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        url:ctx.url,
        session: ctx.session,
    })
}
exports.postSignup = async ctx => {

    let { name, email, password, repeatpass, avator } = ctx.request.body;

    let token = md5([name,password,moment().unix()]);//激活码，格式自己定义

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
                console.log('upload', upload)
                if (upload) {
                     await userModel.insertData([name,email, md5(password), getName + '.png', moment().format('YYYY-MM-DD HH:mm:ss'),token,moment().unix()+(24*60*60),0])
                        .then(res => {
                            console.log('注册成功', res)

                            if(res.affectedRows==1){

                                // 创建一个邮件对象
                                var mail = {
                                    // 发件人
                                    from: '永不言败<727697810@qq.com>',
                                    // 主题 
                                    subject: '新注册用户账号激活邮件',
                                    // 收件人
                                    to: email,
                                    // 邮件内容，HTML格式
                                    html: "亲爱的<b style='color:red'>"+name+"</b>用户!<br/>感谢您注册该论坛系统。<br/>为了更好的使用,请点击下面的链接激活您的帐号。<br/>"+ 
                                    "<a href='http://"+ctx.host+"/active?verify="+token+"'>"+
                                    ctx.host+"/active?verify="+token+"</a><br/> "+
                                    "如果以上链接无法点击，请将它复制到你的浏览器地址栏中进入访问，该链接24小时内有效;"
                                };
                                send(mail);

                                //注册成功
                                ctx.body = {
                                    code: 200,
                                    message: '注册成功'
                                };
                            } else{
                                //注册失败
                                ctx.body = {
                                    code: 100,
                                    message: '注册失败'
                                };
                            }
                            
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


//查询会员列表

exports.getUserlist = async ctx => {

    await userModel.findUserByPage(1)
    .then(result => {
        res = result
     })
    await userModel.findAllUserCount()
    .then(result => {
        postCount = result[0].count
    })

    await ctx.render('userlist', {
        session: ctx.session,
        url:ctx.url,
        msg: '会员列表页面',
        userlist: res,
        postsLength: postCount,
        postsPageLength: Math.ceil(postCount / 10),
    })
}

exports.postUserlist = async ctx => {
    let page = ctx.request.body.page;
    sleep.sleep(1);
    await userModel.findUserByPage(page)
    .then(result => {
        // ctx.body = result;
        ctx.body = {
            "code": 0,
            "message": "成功",
            "userList": result
        }
    }).catch(() => {
        // ctx.body = 'error'
        ctx.body = {
            "code": 1,
            "message": "失败"
        }
         
         
    })
}


exports.getUseractive = async ctx => {

    await checkNotLogin(ctx)

    let verify = ctx.url.split('=')[1] || '';

    console.log('000000'+ctx.query.verify);

    await ctx.render('active_account', {
        title:'注册成功,账号激活',
        url:ctx.url,
        userEmail:ctx.url.split('@')[1],
        verify:ctx.query.verify,
        session: ctx.session,
    });

    if(ctx.query.verify) {

        await userModel.activeUserData(ctx.query.verify);
    }

    // await userModel.activeUserData(verify)
    // .then(result => {
    //     ctx.body = '账号激活成功'
       
    // }).catch(() => {
    //         ctx.body = 'error'
    // })
}