// const router = require('koa-router')()

// const controller = require('../controller/c-posts')

// // router.get('/', controller.getRedirectPosts)


// router.get('/', async (ctx, next) => {

//     ctx.session = null;
//     ctx.body = true
//     console.log(ctx);
//     await ctx.render('index', {
//       title: 'Hello Koa 2!',
//       list:["Uno", "Dos", "Tres","Cuatro", "Cinco", "Seis"],

//     })
// })

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json',
//     list:["Uno", "Dos", "Tres","Cuatro", "Cinco", "Seis"],
//   }
// })


// module.exports = router


const router = require('koa-router')();

router.get('/signout', async(ctx, next) => {
    ctx.session = null;
    console.log('登出成功')
    ctx.body = true
})

module.exports = router