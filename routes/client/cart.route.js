const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.post("/add/:productId", controller.add);
router.get("/", controller.index);
router.get("/delete/:productId", controller.delete);
router.get("/update/:productId/:quantity", controller.update);


module.exports = router;