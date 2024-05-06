const mongoose = require('mongoose');

const masterDocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

const MasterDocument = mongoose.model('MasterDocument', masterDocumentSchema);

module.exports = MasterDocument;
