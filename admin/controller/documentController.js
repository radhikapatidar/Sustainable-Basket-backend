const MasterDocument = require("../model/documentModel");


const getAllDocuments = async (req, res) => {
    try {
        const documents = await MasterDocument.find();
        res.json({ data: documents });
    } catch (error) {
        handleServerError(res, error);
    }
};

const getDocumentById = async (req, res) => {
    try {
        const document = await MasterDocument.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ data: document });
    } catch (error) {
        handleServerError(res, error);
    }
};

const addDocument = async (req, res) => {
    try {
        const newDocument = new MasterDocument(req.body);
        await newDocument.save();
        res.status(201).json({ data: newDocument });
    } catch (error) {
        handleServerError(res, error);
    }
};

const updateDocumentById = async (req, res) => {
    try {
        const updatedDocument = await MasterDocument.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ data: updatedDocument });
    } catch (error) {
        handleServerError(res, error);
    }
};

module.exports = {
    getAllDocuments,
    getDocumentById,
    addDocument,
    updateDocumentById
  };