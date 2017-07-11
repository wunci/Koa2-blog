var router=require('koa-router')();
var userModel=require('../lib/mysql.js')
var moment=require('moment')
var checkNotLogin=require('../middlewares/check.js').checkNotLogin
var checkLogin=require('../middlewares/check.js').checkLogin
router.get('/',async (ctx,next)=>{
	ctx.redirect('/posts')
})
router.get('/posts',async (ctx,next)=>{
	
	if (ctx.request.querystring) {
		console.log('ctx.request.querystring',decodeURIComponent(ctx.request.querystring.split('=')[1]))
		await userModel.findDataByUser(decodeURIComponent(ctx.request.querystring.split('=')[1]))
			.then(result=>{
				res=JSON.parse(JSON.stringify(result))
				console.log(res)
			})
		await ctx.render('posts',{
				session:ctx.session,
				posts:res	
			})
	}else{
		await userModel.findAllPost()
			.then(result=>{
				console.log(result)
				res=JSON.parse(JSON.stringify(result)) 
				console.log('post',res)
			})
		console.log("'res['id']'",res[0]['id'])
		// await userModel.findCommentLength(res[1]['id'])
		// 	.then(result=>{
		// 		console.log('评论数',result)
		// 	})
		await ctx.render('posts',{
			session:ctx.session,
			posts:res	
		})
	}
})


router.get('/posts/:postId',async (ctx,next)=>{
	console.log(ctx.params.postId)
	await userModel.findDataById(ctx.params.postId)
		.then(result=>{
				res=JSON.parse(JSON.stringify(result))
				res_pv=parseInt(JSON.parse(JSON.stringify(result))[0]['pv'])
				res_pv+=1
				console.log(res)
			})
	await userModel.updatePostPv([res_pv,ctx.params.postId])
	await userModel.findCommentById(ctx.params.postId)
			.then(result=>{
				comment_res=JSON.parse(JSON.stringify(result))
				console.log('comment',comment_res)
			})
	await ctx.render('sPost',{
				session:ctx.session,
				posts:res,
				comments:comment_res
			})

})


router.get('/create',async (ctx,next)=>{
	await ctx.render('create',{
		session:ctx.session,
	})
})


router.post('/create',async (ctx,next)=>{
	
	console.log(ctx.session.user)
	
	var title=ctx.request.body.title
	var content=ctx.request.body.content
	var id=ctx.session.id
	var name=ctx.session.user
	var time=moment().format('YYYY-MM-DD HH:mm')
	console.log([name,title,content,id,time])
	
	await userModel.insertPost([name,title,content,id,time])
		.then(()=>{
			ctx.body='true'
		}).catch(()=>{
			ctx.body='false'
		})
	
})


router.post('/:postId',async (ctx,next)=>{
	var name=ctx.session.user
	var content=ctx.request.body.content
	var postId=ctx.params.postId
	
	await userModel.insertComment([name,content,postId])
	await userModel.findDataById(postId)
			.then(result=>{
				res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
				res_comments+=1

			})
	await userModel.updatePostComment([res_comments,postId])
		.then(()=>{
			ctx.body='true'
		}).catch(()=>{
			ctx.body='false'
		})	
})


router.get('/posts/:postId/edit',async (ctx,next)=>{
	var name=ctx.session.user
	var postId=ctx.params.postId
	
	await userModel.findDataById(postId)
		.then(result=>{
			res=JSON.parse(JSON.stringify(result))
			console.log('修改文章',res)
		})
	await  ctx.render('edit',{
			session:ctx.session,
			posts:res
		})
	
})


router.post('/posts/:postId/edit',async (ctx,next)=>{
	var title=ctx.request.body.title
	var content=ctx.request.body.content
	var id=ctx.session.id
	var postId=ctx.params.postId
		
	await userModel.updatePost([title,content,postId])
		.then(()=>{
			ctx.body='true'
		}).catch(()=>{
			ctx.body='false'
		})
	
	
})


router.get('/posts/:postId/remove',async (ctx,next)=>{
	
	var postId=ctx.params.postId
	
	await userModel.deleteAllPostComment(postId)
	await userModel.deletePost(postId)
		.then(()=>{
			 ctx.body={
			 	data:1
			 }
			
		}).catch(()=>{
			ctx.body={
			 	data:2
			 }
		})
	
})

router.get('/posts/:postId/comment/:commentId/remove',async (ctx,next)=>{
	
	var postId=ctx.params.postId
	var commentId=ctx.params.commentId
	await userModel.findDataById(postId)
			.then(result=>{
				res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
				console.log('res',res_comments)
				res_comments-=1
				console.log(res_comments)
			})
	await userModel.updatePostComment([res_comments,postId])
	await userModel.deleteComment(commentId)
		.then(()=>{
			 ctx.body={
			 	data:1
			 }
		}).catch(()=>{
			  ctx.body={
			 	data:2
			 }

		})
	
})


module.exports=router