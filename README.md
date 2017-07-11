# Koa2-blog
node+koa2+mysql
```
创建数据库 博客使用navicat建表
```

* database: nodesql

 | users   | posts    |  comment  |
| --------   | -----:   | :----: |
| id        | id      |   id    |
| name        | name      |   name    |
| pass        | title      |   content    |
|         | content      |   postid    |
|         | uid      |       |
|         | moment      |       |
|         | comments      |       |
|        | pv      |       |

* id主键递增
* name: 用户名
* pass：密码
* title：文章标题
* content：文章内容和评论
* moment：创建时间
* comments：文章评论数
* pv：文章浏览数
* postid：文章id

```
cnpm i && cnpm i supervisor
```
```
supervisor --harmony index
```


> 注册

![](http://oswpupqu5.bkt.clouddn.com/signup.png)

> 登陆

![](http://oswpupqu5.bkt.clouddn.com/signin.png)

> 发表文章

![](http://oswpupqu5.bkt.clouddn.com/create.png)

> 文章详情

![](http://oswpupqu5.bkt.clouddn.com/postcontent.png)

> 文章列表

![](http://oswpupqu5.bkt.clouddn.com/posts.png)

> 个人文章页以及正常编辑删除文章和评论

> 演示

![](http://oswpupqu5.bkt.clouddn.com/blog.gif)
