const userModel = require("../lib/mysql.js");
const moment = require("moment");
const checkLogin = require("../middlewares/check.js").checkLogin;
const md = require("markdown-it")();
const tools = require("../lib/util.js");

/**
 * 重置到文章页
 */
exports.getRedirectPosts = async ctx => {
  ctx.redirect("/posts");
};
/**
 * 文章页
 */
exports.getPosts = async ctx => {
  let res,
    postCount,
    keywords = ctx.query.keywords || "";
  name = decodeURIComponent(ctx.request.querystring.split("=")[1]);
  if (ctx.request.querystring) {
    await userModel.findPostCountByName(name).then(result => {
      postCount = result[0].count;
    });
    await userModel.findPostByUserPage(name, 1).then(result => {
      res = result;
    });
    await ctx.render("selfPosts", {
      session: ctx.session,
      url: ctx.url,
      keywords: keywords,
      posts: res,
      postsPageLength: Math.ceil(postCount / 10)
    });
  } else {
    await userModel.findPostByPage(1).then(result => {
      res = result;
    });
    await userModel.findAllPostCount().then(result => {
      postCount = result[0].count;
    });
    await ctx.render("posts", {
      session: ctx.session,
      url: ctx.url,
      keywords: keywords,
      posts: res,
      postsLength: postCount,
      postsPageLength: Math.ceil(postCount / 10)
    });
  }
  console.log("nowUrl:" + ctx.url);
};
/**
 * 首页分页， 每次输出10条
 */
exports.postPostsPage = async ctx => {
  let page = ctx.request.body.page;
  await userModel
    .findPostByPage(page)
    .then(result => {
      ctx.body = {
        code: 0,
        message: "成功",
        postList: result
      };
    })
    .catch(() => {
      ctx.body = {
        code: 1,
        message: "失败"
      };
    });
};
/**
 * 个人文章分页， 每次输出10条
 */
exports.postSelfPage = async ctx => {
  let data = ctx.request.body;
  await userModel
    .findPostByUserPage(decodeURIComponent(data.name), data.page)
    .then(result => {
      ctx.body = result;
    })
    .catch(() => {
      ctx.body = "error";
    });
};
/**
 * 单篇文章页
 */
exports.getSinglePosts = async ctx => {
  let postId = ctx.params.postId,
    count,
    res,
    pageOne;
  //地址栏输入非法请求做限制~(例如不存在的id,非法数字等.)
  var resultLen = (await userModel.findDataById(postId)).length;
  if (resultLen != 0) {
    await userModel.findDataById(postId).then(result => {
      res = result;
    });
    await userModel.updatePostPv(postId);
    await userModel.findCommentByPage(1, postId).then(result => {
      pageOne = result;
    });
    await userModel.findCommentCountById(postId).then(result => {
      count = result[0].count;
    });

    await userModel.findpostsDataprevnextById(postId).then(result => {
      linkres = result;
    });

    await ctx.render("sPost", {
      url: ctx.url,
      session: ctx.session,
      posts: res[0],
      commentLength: count,
      commentPageLength: Math.ceil(count / 10),
      pageOne: pageOne,
      prevlink: linkres[0].id > postId ? "" : linkres[0],
      nextlink: linkres[0].id > postId ? linkres[0] : linkres[1]
    });
  } else {
    ctx.body = {
      code: 500,
      message: "没有查询到相关信息"
    };
  }
};
/**
 * 发表文章页面
 */
exports.getCreate = async ctx => {
  await checkLogin(ctx);
  await ctx.render("create", {
    url: ctx.url,
    session: ctx.session
  });
};
/**
 * 发表文章
 */
exports.postCreate = async ctx => {
  let { title, content, md } = ctx.request.body,
    id = ctx.session.id,
    name = ctx.session.user,
    time = moment().format("YYYY-MM-DD HH:mm:ss"),
    avator,
    // 现在使用markdown不需要单独转义
    newContent = content,
    newTitle = title;
  console.log([name, newTitle, content, id, time]);
  await userModel.findUserData(ctx.session.user).then(res => {
    avator = res[0]["avator"];
  });
  // await userModel.insertPost([name, newTitle,  newContent, id, time, avator])
  // let _sql = "insert into posts set name=?,title=?,content=?,uid=?,moment=?,avator=?;"
  await userModel
    .insertPost([name, newTitle, content, md, id, time, avator])

    .then(() => {
      ctx.body = {
        code: 200,
        message: "发表文章成功"
      };
    })
    .catch(() => {
      ctx.body = {
        code: 500,
        message: "发表文章失败"
      };
    });
};

/**
 * 搜索文章
 *
 */
exports.getSearch = async ctx => {
  let data = ctx.request.body;
  let res,
    postCount,
    searchType = ctx.query.type,
    keywords = ctx.query.keywords;
  let page = data.page || 1;
  console.log("gjc:" + ctx.query.keywords);
  await userModel.findSearchresultCount(searchType, keywords).then(result => {
    postCount = result[0].count;
  });
  await await userModel
    .findPostBykeywordsPage(searchType, keywords, page)
    .then(result => {
      // res = result
      result.forEach(function(item) {
        item.content = tools.delHtmlTag(item.content);
        item.content = tools.cutString(item.content, 50, "...");
      });
      res = result;
    });
  await ctx.render("search", {
    session: ctx.session,
    url: ctx.url,
    searchlist: res,
    totalCount: postCount,
    searchType: searchType,
    keywords: keywords,
    postsPageLength: Math.ceil(postCount / 10)
  });
};

exports.postSearchPage = async ctx => {
  let page = ctx.request.body.page;
  let keywords = ctx.request.body.keywords;
  let searchType = ctx.request.body.searchType;
  console.log(keywords);
  await userModel
    .findPostBykeywordsPage(searchType, decodeURIComponent(keywords), page)
    .then(result => {
      result.forEach(function(item) {
        item.content = tools.delHtmlTag(item.content);
        item.content = tools.cutString(item.content, 50, "...");
      });
      // ctx.body = result
      ctx.body = {
        code: 0,
        message: "成功",
        resultList: result
      };
    })
    .catch(() => {
      ctx.body = "error";
    });
};

/**
 * 发表评论
 */
exports.postComment = async ctx => {
  let name = ctx.session.user,
    content = ctx.request.body.content,
    md = ctx.request.body.md,
    postId = ctx.params.postId,
    time = moment().format("YYYY-MM-DD HH:mm:ss"),
    avator;
  await userModel.findUserData(ctx.session.user).then(res => {
    avator = res[0]["avator"];
  });
  await userModel.insertComment([name, content, md, time, postId, avator]);
  await userModel
    .addPostCommentCount(postId)
    .then(() => {
      ctx.body = {
        code: 200,
        message: "评论成功"
      };
    })
    .catch(() => {
      ctx.body = {
        code: 500,
        message: "评论失败"
      };
    });
};
/**
 * 编辑单篇文章页面
 */
exports.getEditPage = async ctx => {
  let name = ctx.session.user,
    postId = ctx.params.postId,
    res;
  await checkLogin(ctx);
  await userModel.findDataById(postId).then(result => {
    res = result[0];
  });
  await ctx.render("edit", {
    session: ctx.session,
    url: ctx.url,
    postsContent: res.content,
    postsMd: res.md,
    postsTitle: res.title
  });
};
/**
 * post 编辑单篇文章
 */
exports.postEditPage = async ctx => {
  let title = ctx.request.body.title,
    content = ctx.request.body.content,
    md = ctx.request.body.md,
    id = ctx.session.id,
    postId = ctx.params.postId,
    allowEdit = true,
    // 现在使用markdown不需要单独转义
    newTitle = title.replace(/[<">']/g, target => {
      return {
        "<": "&lt;",
        '"': "&quot;",
        ">": "&gt;",
        "'": "&#39;"
      }[target];
    }),
    newContent = content.replace(/[<">']/g, target => {
      return {
        "<": "&lt;",
        '"': "&quot;",
        ">": "&gt;",
        "'": "&#39;"
      }[target];
    });
  await userModel.findDataById(postId).then(res => {
    if (res[0].name != ctx.session.user) {
      allowEdit = false;
    } else {
      allowEdit = true;
    }
  });
  if (allowEdit) {
    await userModel
      .updatePost([newTitle, content, md, postId])
      .then(() => {
        ctx.body = {
          code: 200,
          message: "编辑成功"
        };
      })
      .catch(() => {
        ctx.body = {
          code: 500,
          message: "编辑失败"
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: "无权限"
    };
  }
};
/**
 * 删除单篇文章
 */
exports.postDeletePost = async ctx => {
  let postId = ctx.params.postId,
    allow;
  await userModel.findDataById(postId).then(res => {
    if (res[0].name != ctx.session.user) {
      allow = false;
    } else {
      allow = true;
    }
  });
  if (allow) {
    await userModel.deleteAllPostComment(postId);
    await userModel
      .deletePost(postId)
      .then(() => {
        ctx.body = {
          code: 200,
          message: "删除文章成功"
        };
      })
      .catch(() => {
        ctx.body = {
          code: 500,
          message: "删除文章失败"
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: "无权限"
    };
  }
};
/**
 * 删除评论
 */
exports.postDeleteComment = async ctx => {
  let postId = ctx.params.postId,
    commentId = ctx.params.commentId,
    allow;
  await userModel.findComment(commentId).then(res => {
    if (res[0].name != ctx.session.user) {
      allow = false;
    } else {
      allow = true;
    }
  });
  if (allow) {
    await userModel.reducePostCommentCount(postId);
    await userModel
      .deleteComment(commentId)
      .then(() => {
        ctx.body = {
          code: 200,
          message: "删除评论成功"
        };
      })
      .catch(() => {
        ctx.body = {
          code: 500,
          message: "删除评论失败"
        };
      });
  } else {
    ctx.body = {
      code: 404,
      message: "无权限"
    };
  }
};
/**
 * 评论分页
 */
exports.postCommentPage = async function(ctx) {
  let postId = ctx.params.postId,
    page = ctx.request.body.page;
  await userModel
    .findCommentByPage(page, postId)
    .then(res => {
      ctx.body = res;
    })
    .catch(() => {
      ctx.body = "error";
    });
};
