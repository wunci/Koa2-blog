const userModel = require("../lib/mysql.js");
const md5 = require("md5");
const checkNotLogin = require("../middlewares/check.js").checkNotLogin;
const checkLogin = require("../middlewares/check.js").checkLogin;

var http = require("http");
var fs = require("fs");
var BMP24 = require("gd-bmp").BMP24;
// var captchapng = require('captchapng');

const ccap = require("ccap")();

exports.getSignin = async ctx => {
  await checkNotLogin(ctx);

  await ctx.render("signin", {
    url: ctx.url,
    session: ctx.session
  });
};
exports.postSignin = async ctx => {
  console.log(ctx.request.body);
  let { name, password } = ctx.request.body;
  console.log(ctx.cookies.get("captcha"));

  await userModel
    .findDataByName(name)
    .then(result => {
      let res = result;
      if (
        res.length &&
        name === res[0]["name"] &&
        md5(password) === res[0]["pass"]
      ) {
        ctx.session = {
          user: res[0]["name"],
          id: res[0]["id"]
        };
        ctx.body = {
          code: 200,
          message: "登录成功"
        };
        console.log("ctx.session.id", ctx.session.id);
        console.log("session", ctx.session);
        console.log("登录成功");
      } else {
        ctx.body = {
          code: 500,
          message: "用户名或密码错误,或者没有激活账号"
        };
        console.log("用户名或密码错误!");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCaptchas = async (ctx, next) => {
  function rand(min, max) {
    return (Math.random() * (max - min + 1) + min) | 0; //特殊的技巧，|0可以强制转换为整数
  }

  function makeCapcha() {
    var img = new BMP24(100, 40);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10, 40), rand(0, 0xffffff));
    //边框
    img.drawRect(0, 0, img.w - 1, img.h - 1, rand(0, 0xffffff));
    img.fillRect(0, 0, 100, 40, 0x252632);

    img.drawLine(
      rand(0, 100),
      rand(0, 40),
      rand(0, 100),
      rand(0, 40),
      rand(0, 0xffffff)
    );
    //return img;
    //画曲线
    var w = img.w / 2;
    var h = img.h;
    var color = rand(0, 0xffffff);
    var y1 = rand(-5, 5); //Y轴位置调整
    var w2 = rand(10, 15); //数值越小频率越高
    var h3 = rand(4, 6); //数值越小幅度越大
    var bl = rand(1, 5);
    for (var i = -w; i < w; i += 0.1) {
      var y = Math.floor((h / h3) * Math.sin(i / w2) + h / 2 + y1);
      var x = Math.floor(i + w);
      for (var j = 0; j < bl; j++) {
        img.drawPoint(x, y + j, color);
        img.drawPoint(x, y + j, color);
      }
    }

    var p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
    var str = "";
    for (var i = 0; i < 4; i++) {
      str += p.charAt((Math.random() * p.length) | 0);
    }

    var fonts = [BMP24.font12x24, BMP24.font16x32];
    var x = 15,
      y = 8;
    for (var i = 0; i < str.length; i++) {
      var f = fonts[(Math.random() * fonts.length) | 0];
      y = 8 + rand(-5, 5);
      img.drawChar(str[i], x, y, f, rand(0xaaaaaa, 0xffffff));
      x += f.w + rand(2, 8);
    }
    return { code: str, img };
    // return img;
  }

  var img = makeCapcha();
  console.log(img);
  ctx.type = "image/bmp";

  ctx.body = {
    code: img.code,
    img: "data:image/bmp;base64," + img.img.getFileData().toString("base64")
  };
  // await ctx.render('captchas', {
  //     code:'data:image/bmp;base64,' + img.img.getFileData().toString('base64')
  // })

  // return img.getFileData();
};
