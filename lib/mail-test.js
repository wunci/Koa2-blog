const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')

const nodemailer = require('nodemailer');


// 创建一个SMTP客户端配置
var config = {
    host: 'smtp.qq.com', 
    port: 465,
    auth: {
        user: '727697810@qq.com', //刚才注册的邮箱账号
        pass: 'esdgixncmyujbbfj'  //邮箱的授权码，不是注册时的密码
    }
};

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};