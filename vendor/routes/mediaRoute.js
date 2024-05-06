const express = require("express");
const { createMedia, getAllMedia } = require("../controller/mediaController");
const router = express.Router();

router.post('/',createMedia)
router.get('/get',getAllMedia)
module.exports = router;