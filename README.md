# Koa2-blog
node+koa2+mysql

> 1、创建数据库 博客使用navicat建表

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

> 2、cnpm i && cnpm i supervisor

> 3、supervisor --harmony index



