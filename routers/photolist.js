const router = require("koa-router")();
const controller = require("../controller/c-photolist");

// 相册列表页面
router.get("/photolist", controller.getPhotolist);

// 相册详情页面
router.get("/photolist/Detail/:photoId", controller.getSinglePhoto);

router.post("/photolist/page", controller.postPhotolist);
// 上传图片页面
router.get("/upload", controller.getPhotoupload);

//上传文件处理方法
router.post("/uploadpic", controller.postPhotoupload);

//账号激活
// router.get('/active', controller.getUseractive)

module.exports = router;
