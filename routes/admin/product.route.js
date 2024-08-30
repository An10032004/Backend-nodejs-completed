const express = require('express')
const multer = require('multer')
const router = express.Router();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// const storageMulter = require('../../helpers/storageMulter')

const upload = multer()

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single('thumbnail'), validate.createPost, controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router;
