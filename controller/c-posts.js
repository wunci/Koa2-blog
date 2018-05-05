
const userModel = require('../lib/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();  
/**
 * 重置到文章页
 */
exports.getRedirectPosts = async ctx => {
    ctx.redirect('/posts')
}
/**
 * 文章页
 */
exports.getPosts = async ctx => {
    let res,
        postsLength,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
    if (ctx.request.querystring) {
        await userModel.findDataByUser(name)
            .then(result => {
                postsLength = result.length
            })
        await userModel.findPostByUserPage(name, 1)
            .then(result => {
                res = result
            })
        await ctx.render('selfPosts', {
            session: ctx.session,
            posts: res,
            postsPageLength: Math.ceil(postsLength / 10),
        })
    } else {
        await userModel.findPostByPage(1)
            .then(result => {
                res = result
            })
        await userModel.findAllPost()
            .then(result => {
                postsLength = result.length
            })
        await ctx.render('posts', {
            session: ctx.session,
            posts: res,
            postsLength: postsLength,
            postsPageLength: Math.ceil(postsLength / 10),

        })
    }
}
/**
 * 首页分页， 每次输出10条
 */
exports.postPostsPage = async ctx => {
    let page = ctx.request.body.page;
    await userModel.findPostByPage(page)
        .then(result => {
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
}
/**
 * 个人文章分页， 每次输出10条
 */
exports.postSelfPage = async ctx => {
    let data = ctx.request.body
    await userModel.findPostByUserPage(data.name, data.page)
        .then(result => {
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
}
/**
 * 单篇文章页
 */
exports.getSinglePosts = async ctx => {
    let postId = ctx.params.postId,
        comment_res,
        res,
        pageOne,
        res_pv;
    await userModel.findDataById(postId)
        .then(result => {
            res = result
            res_pv = parseInt(result[0]['pv'])
            res_pv += 1
        })
    await userModel.updatePostPv([res_pv, postId])
    await userModel.findCommentByPage(1, postId)
        .then(result => {
            pageOne = result
        })
    await userModel.findCommentById(postId)
        .then(result => {
            comment_res = result
        })
    await ctx.render('sPost', {
        session: ctx.session,
        posts: res[0],
        commentLenght: comment_res.length,
        commentPageLenght: Math.ceil(comment_res.length / 10),
        pageOne: pageOne
    })

}
/**
 * 发表文章页面
 */
exports.getCreate = async ctx => {
    await checkLogin(ctx)
    await ctx.render('create', {
        session: ctx.session,
    })
}
/**
 * 发表文章
 */
exports.postCreate = async ctx => {
    let {title,content} = ctx.request.body,
        id = ctx.session.id,
        name = ctx.session.user,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        avator,
        // 现在使用markdown不需要单独转义
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });

    await userModel.findUserData(ctx.session.user)
        .then(res => {
            avator = res[0]['avator']
        })
    await userModel.insertPost([name, newTitle, md.render(content), content, id, time, avator])
        .then(() => {
            ctx.body = {
                code:200,
                message:'发表文章成功'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: '发表文章失败'
            }
        })
}
/**
 * 发表评论
 */
exports.postComment = async ctx => {
    let name = ctx.session.user,
        content = ctx.request.body.content,
        postId = ctx.params.postId,
        res_comments,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        avator;
    await userModel.findUserData(ctx.session.user)
        .then(res => {
            avator = res[0]['avator']
        })
    await userModel.insertComment([name, md.render(content), time, postId, avator])
    await userModel.findDataById(postId)
        .then(result => {
            res_comments = parseInt(result[0]['comments'])
            res_comments += 1
        })
    await userModel.updatePostComment([res_comments, postId])
        .then(() => {
            ctx.body = {
                code:200,
                message:'评论成功'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: '评论失败'
            }
        })
}
/**
 * 编辑单篇文章页面
 */
exports.getEditPage = async ctx => {
    let name = ctx.session.user,
        postId = ctx.params.postId,
        res;
    await checkLogin(ctx)
    await userModel.findDataById(postId)
        .then(result => {
            res = result[0]
        })
    await ctx.render('edit', {
        session: ctx.session,
        postsContent: res.md,
        postsTitle: res.title
    })

}
/**
 * post 编辑单篇文章
 */
exports.postEditPage = async ctx => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        id = ctx.session.id,
        postId = ctx.params.postId,
        allowEdit = true,
        // 现在使用markdown不需要单独转义
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    await userModel.findDataById(postId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allowEdit = false
            } else {
                allowEdit = true
            }
        })
    if (allowEdit) {
        await userModel.updatePost([newTitle, md.render(content), content, postId])
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '编辑成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '编辑失败'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}
/**
 * 删除单篇文章
 */
exports.postDeletePost = async ctx => {
    let postId = ctx.params.postId,
        allow;
    await userModel.findDataById(postId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userModel.deleteAllPostComment(postId)
        await userModel.deletePost(postId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '删除文章成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '删除文章失败'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}
/**
 * 删除评论
 */
exports.postDeleteComment = async ctx => {
    let postId = ctx.params.postId,
        commentId = ctx.params.commentId,
        res_comments,
        allow;
    await userModel.findComment(commentId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userModel.findDataById(postId)
            .then(result => {
                res_comments = parseInt(result[0]['comments'])
                res_comments -= 1
            })
        await userModel.updatePostComment([res_comments, postId])
        await userModel.deleteComment(commentId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '删除评论成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '删除评论失败'
                }

            })
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}
/**
 * 评论分页
 */
exports.postCommentPage = async function (ctx) {
    let postId = ctx.params.postId,
        page = ctx.request.body.page;
    await userModel.findCommentByPage(page, postId)
        .then(res => {
            ctx.body = res
        }).catch(() => {
            ctx.body = 'error'
        })
}