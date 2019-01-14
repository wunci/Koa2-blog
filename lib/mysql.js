var mysql = require("mysql");
var config = require("../config/default.js");
const md5 = require("md5");
var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT
});

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

// let query = function( sql, values ) {
// pool.getConnection(function(err, connection) {
//   // 使用连接
//   connection.query( sql,values, function(err, rows) {
//     // 使用连接执行查询
//     console.log(rows)
//     connection.release();
//     //连接不再使用，返回到连接池
//   });
// });
// }

let users = `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     pass VARCHAR(100) NOT NULL COMMENT '密码',
     avator VARCHAR(100) NOT NULL COMMENT '头像',
     moment VARCHAR(100) NOT NULL COMMENT '注册时间',
     PRIMARY KEY ( id )
    );`;

let posts = `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '文章作者',
     title TEXT(0) NOT NULL COMMENT '评论题目',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     md TEXT(0) NOT NULL COMMENT 'markdown',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     moment VARCHAR(100) NOT NULL COMMENT '发表时间',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id)
    );`;

let comment = `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     postid VARCHAR(40) NOT NULL COMMENT '文章id',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id) 
    );`;

let photos = `CREATE TABLE if not exists photos(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  title VARCHAR(100)  DEFAULT null  COMMENT '图片标题',
  desccon VARCHAR(300) DEFAULT null COMMENT '图片描述',
  path VARCHAR(100)  COMMENT '图片路径',
  uploadtime VARCHAR(100) COMMENT '上传时间',
  PRIMARY KEY (id)
)`;

let createTable = sql => {
  return query(sql, []);
};

// 建表
createTable(users);
createTable(posts);
createTable(comment);
createTable(photos);
// 注册用户
exports.insertData = value => {
  let _sql =
    "insert into users set name=?,email=?,pass=?,avator=?,moment=?,token=?,token_exptime=?,status=?;";
  console.log(_sql);
  return query(_sql, value);
};
// 删除用户
exports.deleteUserData = name => {
  let _sql = `delete from users where name="${name}";`;
  return query(_sql);
};

exports.activeUserData = verify => {
  let _sql = `update users set status='1' where token="${verify}";`;
  console.log(_sql);
  return query(_sql);
};

// 查找用户
exports.findUserData = name => {
  let _sql = `select * from users where name="${name}";`;
  console.log(_sql);
  return query(_sql);
};

// 发表文章
exports.insertPost = value => {
  let _sql =
    "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;";
  console.log(_sql);
  return query(_sql, value);
};
// 增加文章评论数
exports.addPostCommentCount = value => {
  let _sql = "update posts set comments = comments + 1 where id=?";
  return query(_sql, value);
};
// 减少文章评论数
exports.reducePostCommentCount = value => {
  let _sql = "update posts set comments = comments - 1 where id=?";
  return query(_sql, value);
};

// 更新浏览数
exports.updatePostPv = value => {
  let _sql = "update posts set pv= pv + 1 where id=?";
  return query(_sql, value);
};

// 发表评论
exports.insertComment = value => {
  let _sql =
    "insert into comment set name=?,content=?,md=?,moment=?,postid=?,avator=?;";
  return query(_sql, value);
};
// 通过名字查找用户
exports.findDataByName = name => {
  let _sql = `select * from users where name="${name}" && status=1;`;
  return query(_sql);
};
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName = name => {
  let _sql = `select count(*) as count from users where name="${name}";`;
  return query(_sql);
};
// 通过文章的名字查找用户
exports.findDataByUser = name => {
  let _sql = `select * from posts where name="${name}";`;
  return query(_sql);
};
// 通过文章id查找
exports.findDataById = id => {
  let _sql = `select * from posts where id="${id}";`;
  return query(_sql);
};
// 通过文章id查找
exports.findCommentById = id => {
  let _sql = `select * from comment where postid="${id}";`;
  return query(_sql);
};

// 通过文章id查找评论数
exports.findCommentCountById = id => {
  let _sql = `select count(*) as count from comment where postid="${id}";`;
  return query(_sql);
};

// 通过评论id查找
exports.findComment = id => {
  let _sql = `select * from comment where id="${id}";`;
  return query(_sql);
};
// 查询所有文章
exports.findAllPost = () => {
  let _sql = `select * from posts;`;
  return query(_sql);
};
// 查询所有文章数量
exports.findAllPostCount = () => {
  let _sql = `select count(*) as count from posts;`;
  return query(_sql);
};
// 查询分页文章
exports.findPostByPage = page => {
  let _sql = ` select * from posts order by moment desc limit ${(page - 1) *
    10},10;`;
  return query(_sql);
};

// 查询所有会员数量
exports.findAllUserCount = () => {
  let _sql = `select count(*) as count from users;`;
  console.log(_sql);
  return query(_sql);
};
// 查询分页会员
exports.findUserByPage = page => {
  let _sql = ` select * from users order by id asc limit ${(page - 1) *
    10},10;`;
  console.log(_sql);
  return query(_sql);
};

// 查询所有个人用户文章数量
exports.findPostCountByName = name => {
  let _sql = `select count(*) as count from posts where name="${name}";`;
  return query(_sql);
};
// 查询个人分页文章
exports.findPostByUserPage = (name, page) => {
  let _sql = ` select * from posts where name="${name}" order by id desc limit ${(page -
    1) *
    10},10 ;`;
  return query(_sql);
};

//查询搜索结果所有
exports.findSearchresultCount = (searchType, keywords) => {
  let _sql = ``;
  if (searchType === "article") {
    _sql = `select count(*) as count from posts where content like '%${keywords}%';`;
  } else {
    _sql = `select count(*) as count from posts where name = "${keywords}";`;
  }
  console.log(_sql);
  return query(_sql);
};

//顶部搜索功能新增
exports.findPostBykeywordsPage = (searchType, keywords, page) => {
  let _sql = ``;
  if (searchType === "article") {
    _sql = `select * from posts where content like '%${keywords}%' order by id desc limit ${(page -
      1) *
      10},10 ;`;
  } else {
    _sql = ` select * from posts where name="${keywords}" order by id desc limit ${(page -
      1) *
      10},10 ;`;
  }
  console.log(_sql);
  return query(_sql);
};

// 更新修改文章
exports.updatePost = values => {
  let _sql = `update posts set title=?,content=?,md=? where id=?`;
  return query(_sql, values);
};
// 删除文章
exports.deletePost = id => {
  let _sql = `delete from posts where id = ${id}`;
  return query(_sql);
};
// 删除评论
exports.deleteComment = id => {
  let _sql = `delete from comment where id=${id}`;
  return query(_sql);
};
// 删除所有评论
exports.deleteAllPostComment = id => {
  let _sql = `delete from comment where postid=${id}`;
  return query(_sql);
};

// 滚动无限加载数据
exports.findPageById = page => {
  let _sql = `select * from posts limit ${(page - 1) * 5},5;`;
  return query(_sql);
};
// 评论分页
exports.findCommentByPage = (page, postId) => {
  let _sql = `select * from comment where postid=${postId} order by id desc limit ${(page -
    1) *
    10},10;`;
  return query(_sql);
};

// 图片上传(上传图片sql语句)
exports.insertphotoData = value => {
  let _sql =
    "insert into photos set name=?,title=?,desccon=?,path=?,uploadtime=?;";
  console.log(_sql);
  console.log(value);
  return query(_sql, value);
};

// 查询相册分页
exports.findphotoPostByPage = page => {
  let _sql = ` select * from photos order by uploadtime desc limit ${(page -
    1) *
    10},10;`;
  return query(_sql);
};

// 查询所有文章数量
exports.findphotoAllPostCount = () => {
  let _sql = `select count(*) as count from photos;`;
  return query(_sql);
};

// 查询分页文章
exports.findPostphotoByPage = page => {
  let _sql = ` select * from photos order by uploadtime desc limit ${(page -
    1) *
    10},10;`;
  return query(_sql);
};

// 通过相册id查找详情
exports.findphotoDataById = id => {
  let _sql = `select * from photos where id="${id}";`;
  return query(_sql);
};

//相册页面,获取上一篇,下一篇
exports.findphotoDataprevnextById = id => {
  let _sql = ` (SELECT * FROM photos WHERE id < "${id}" ORDER BY id DESC LIMIT 0,1) UNION ALL (select * from photos where id>"${id}" ORDER BY id ASC LIMIT 0,1)`;
  console.log(_sql);
  return query(_sql);
};

//文章详情页面,获取上一篇,下一篇
exports.findpostsDataprevnextById = id => {
  let _sql = ` (SELECT * FROM posts WHERE id < "${id}" ORDER BY id DESC LIMIT 0,1) UNION ALL (select * from posts where id>"${id}" ORDER BY id ASC LIMIT 0,1)`;
  console.log(_sql);
  return query(_sql);
};

//通过注册邮箱重置登录密码
exports.resetpasswordByuEmail = (name, email, pass) => {
  let _sql = `update users set pass = md5('${pass}') where name='${name}' and email="${email}";`;

  console.log(_sql);
  return query(_sql);
};
