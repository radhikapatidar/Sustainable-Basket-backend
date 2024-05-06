const express = require('express');
const { addTitle, getAllTitles, updateTitle, getTitleById, checkDuplicateTitle } = require('../controller/masterDocumentCtrl');
const router = express.Router();

router.post('/add',addTitle);
router.post('/duplicate',checkDuplicateTitle);
router.get('/',getAllTitles);
router.get('/:id',getTitleById)
router.put('/update/:id',updateTitle)

module.exports = router;
