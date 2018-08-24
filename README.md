# Koa2-blog（有问题可以加qq群:725165362）
node+koa2+mysql (欢迎star)

> 现在最新的代码有变动，请参照最新的代码，新增了上传头像、分页、markdown语法等


教程 [Node+Koa2+Mysql 搭建简易博客](http://www.wclimb.site/2017/07/12/Node-Koa2-Mysql-%E6%90%AD%E5%BB%BA%E7%AE%80%E6%98%93%E5%8D%9A%E5%AE%A2/) 

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
|   id    |   id    |   id    |
|   name    |   name    |   name    |
|   pass    |   title    |   content    |
|   avator     | content      |   moment    |
|    moment     | md      |    postid   |
|     -    | uid      |   avator    |
|     -    | moment      |    -   |
|     -   | comments      |    -   |      
|     -   | pv             |   -   |      
|     -   |  avator       |    -   |    


* id主键递增
* name: 用户名
* pass：密码
* avator：头像
* title：文章标题
* content：文章内容和评论
* md：markdown语法
* uid：发表文章的用户id 
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
$ cnpm i supervisor -g
```
```
$ cnpm i 
```
```
$ npm run dev(运行项目)
```
```
$ npm test(测试项目)
```
### 演示

![](http://www.wclimb.site/cdn/blog1.gif)

### 注册

![](http://www.wclimb.site/cdn/signup1.png)

### 登陆

![](http://www.wclimb.site/cdn/signin1.png)

### 发表文章

![](http://www.wclimb.site/cdn/create1.png)

### 文章详情

![](http://www.wclimb.site/cdn/postcontent1.png)

### 文章列表

![](http://www.wclimb.site/cdn/posts1.png)

### 个人文章页以及正常编辑删除文章和评论

### 个人小程序

![img](http://www.wclimb.site/cdn/xcx.jpeg?v=1) 

