# Koa2-blog
node+koa2+mysql (欢迎star)

教程 [Node+Koa2+Mysql 搭建简易博客](https://wclimb.github.io/2017/07/12/Node-Koa2-Mysql-%E6%90%AD%E5%BB%BA%E7%AE%80%E6%98%93%E5%8D%9A%E5%AE%A2/) 

### 创建数据库 

登录数据库
```
$ mysql -u root -p
```
创建数据库
```
$ create database nodesql;
```
使用创建的数据库
```
$ use nodesql;
```

> database: nodesql  tables: users posts comment  (已经在lib/mysql建表)

 | users   | posts    |  comment  |
| :----: | :----:   | :----: |
| id        | id      |   id    |
| name        | name      |   name    |
| pass        | title      |   content    |
|         | content      |   postid    |
|         | uid      |       |
|         | moment      |       |
|         | comments      |       |
|        | pv      |       |      |

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
$ git clone https://github.com/wclimb/Koa2-blog.git
```
```
$ cd Koa2-blog
```
```
$ cnpm i supervisor
$ cnpm i 
```
```
$ supervisor --harmony index
```
### 演示

![](http://oswpupqu5.bkt.clouddn.com/blog.gif)

### 注册

![](http://oswpupqu5.bkt.clouddn.com/signup.png)

### 登陆

![](http://oswpupqu5.bkt.clouddn.com/signin.png)

### 发表文章

![](http://oswpupqu5.bkt.clouddn.com/create.png)

### 文章详情

![](http://oswpupqu5.bkt.clouddn.com/postcontent.png)

### 文章列表

![](http://oswpupqu5.bkt.clouddn.com/posts.png)

### 个人文章页以及正常编辑删除文章和评论


