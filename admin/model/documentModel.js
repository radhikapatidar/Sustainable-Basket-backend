const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    validFromDate: {
        type: Date,
        default: Date.now,
    },
    validToDate: {
        type: Date,
    },
},
{
    timestamps: true,
});

const MasterDocument = mongoose.model('MasterDocument', documentSchema);

module.exports = MasterDocument;
