const router = require('koa-router')();
const controller = require('../controller/c-posts')

// 重置到文章页
router.get('/', controller.getRedirectPosts)
// 文章页
router.get('/posts', controller.getPosts)
// 首页分页，每次输出10条
router.post('/posts/page', controller.postPostsPage)
// 个人文章分页，每次输出10条
router.post('/posts/self/page', controller.postSelfPage)
// 单篇文章页
router.get('/posts/:postId', controller.getSinglePosts)
// 发表文章页面
router.get('/create', controller.getCreate)
// post 发表文章
router.post('/create', controller.postCreate)
// 发表评论
router.post('/:postId',controller.postComment)
// 编辑单篇文章页面
router.get('/posts/:postId/edit', controller.getEditPage)
// post 编辑单篇文章
router.post('/posts/:postId/edit', controller.postEditPage)
// 删除单篇文章
router.post('/posts/:postId/remove', controller.postDeletePost)
// 删除评论
router.post('/posts/:postId/comment/:commentId/remove', controller.postDeleteComment)
// 评论分页
router.post('/posts/:postId/commentPage', controller.postCommentPage)

module.exports = router