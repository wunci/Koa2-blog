const userModel = require("../lib/mysql.js");
const md5 = require("md5");
const checkNotLogin = require("../middlewares/check.js").checkNotLogin;
const checkLogin = require("../middlewares/check.js").checkLogin;
const moment = require("moment");
const fs = require("fs");

var sleep = require("sleep");
const multer = require("koa-multer");

//配置
// var storage = multer.diskStorage({
//   //文件保存路径
//   destination: function(req, file, cb) {
//     cb(null, "public/uploads/");
//   },
//   //修改文件名称
//   filename: function(req, file, cb) {
//     var fileFormat = file.originalname.split(".");
//     cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// });
//加载配置
// var upload = multer({ storage: storage });

// var sleep = require("sleep");

exports.getPhotolist = async ctx => {
  //   await checkNotLogin(ctx);
  //   await ctx.render("photolist", {
  //     url: ctx.url,
  //     session: ctx.session
  //   });

  let res, postCount;
  await userModel.findphotoPostByPage(1).then(result => {
    res = result;
  });
  await userModel.findphotoAllPostCount().then(result => {
    postCount = result[0].count;
  });
  await ctx.render("photolist", {
    session: ctx.session,
    url: ctx.url,
    posts: res,
    postsLength: postCount,
    postsPageLength: Math.ceil(postCount / 10)
  });
};

//查询相册方法(分页加载)
exports.postPhotolist = async ctx => {
  let postCount;
  let page = ctx.request.body.page;
  await userModel.findphotoAllPostCount().then(result => {
    postCount = result[0].count;
  });
  await userModel.findphotoAllPostCount().then(result => {
    postCount = result[0].count;
  });
  sleep.sleep(1);
  await userModel
    .findPostphotoByPage(page)
    .then(result => {
      ctx.body = {
        code: 0,
        message: "成功",
        postList: result,
        totalCount: postCount,
        pageLength: Math.ceil(postCount / 10),
        cpage: page
      };
    })
    .catch(() => {
      // ctx.body = 'error'
      ctx.body = {
        code: 1,
        message: "失败"
      };
    });
};

exports.getPhotoupload = async ctx => {
  //   return;
  //   await checkNotLogin(ctx);
  console.log(ctx.session);
  if (JSON.stringify(ctx.session) != "{}") {
    await ctx.render("uploadfile", {
      url: ctx.url,
      session: ctx.session
    });
  } else {
    ctx.redirect("/signin");
  }
};

exports.postPhotoupload = async ctx => {
  let name = ctx.session.user,
    title = ctx.request.body.title,
    describe = ctx.request.body.content,
    path = ctx.request.body.path,
    uploadtime = moment().format("YYYY-MM-DD HH:mm:ss");
  let base64Data = path.replace(/^data:image\/\w+;base64,/, ""),
    dataBuffer = new Buffer(base64Data, "base64"),
    getName =
      Number(
        Math.random()
          .toString()
          .substr(3)
      ).toString(36) + Date.now(),
    upload = await new Promise((reslove, reject) => {
      fs.writeFile("./public/uploads/" + getName + ".png", dataBuffer, err => {
        if (err) {
          throw err;
          reject(false);
        }
        reslove(true);
      });
    });

  await userModel
    .insertphotoData([name, title, describe, getName + ".png", uploadtime])
    .then(() => {
      ctx.body = {
        code: 200,
        message: "提交成功"
      };
    })
    .catch(() => {
      ctx.body = {
        code: 500,
        message: "提交失败"
      };
    });
};

exports.getSinglePhoto = async ctx => {
  let photoId = ctx.params.photoId;

  //地址栏输入非法请求做限制~(例如不存在的id,非法数字等.)
  var resultLen = (await userModel.findphotoDataById(photoId)).length;
  if (resultLen != 0) {
    await userModel.findphotoDataById(photoId).then(result => {
      res = result;
    });

    await userModel.findphotoDataprevnextById(photoId).then(result => {
      linkres = result;
    });
    await ctx.render("photoDetail", {
      url: ctx.url,
      session: ctx.session,
      posts: res[0],
      prevlink: linkres[0].id > photoId ? "" : linkres[0],
      nextlink: linkres[0].id > photoId ? linkres[0] : linkres[1]
    });
  } else {
    ctx.body = {
      code: 500,
      message: "没有查询到相关信息"
    };
  }
};
