const express = require('express');
const { addDocument, getAllDocuments, getDocumentById, updateDocumentById } = require('../controller/documentController');
const router = express.Router();


router.post('/upload-document',addDocument);
router.get('/get-document',getAllDocuments);
router.get('/:id',getDocumentById);
router.put('/update/:id',updateDocumentById)

module.exports = router;