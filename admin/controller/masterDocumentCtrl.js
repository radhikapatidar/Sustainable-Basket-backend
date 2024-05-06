const MasterDocument = require("../model/masterDocumentModel");


// Get all titles
const getAllTitles = async (req, res) => {
    try {
        const titles = await MasterDocument.find();
        res.json(titles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get title by ID
const getTitleById = async (req, res) => {
    const { id } = req.params;

    try {
        const title = await MasterDocument.findById(id);

        if (!title) {
            return res.status(404).json({ message: 'Title not found' });
        }

        res.json(title);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new title
const addTitle = async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTitle = new MasterDocument({ title });
        const savedTitle = await newTitle.save();
        res.status(201).json(savedTitle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update title by ID
const updateTitle = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const updatedTitle = await MasterDocument.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        if (!updatedTitle) {
            return res.status(404).json({ message: 'Title not found' });
        }

        res.json(updatedTitle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//checkDuplicateTitle 
const checkDuplicateTitle = async (req, res) => {
    const { title } = req.body; // Assuming title is sent in the request body

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        // Query your database or data store to check if the title already exists
        const existingTitle = await MasterDocument.findOne({ title });
        
        console.log('Existing Title:', existingTitle); // Debugging line

        if (existingTitle) {
            // If the title exists, return true indicating it is a duplicate
            res.json({ isDuplicate: true });
        } else {
            // If the title does not exist, return false indicating it is not a duplicate
            res.json({ isDuplicate: false });
        }
    } catch (error) {
        console.error('Error:', error); // Debugging line
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getAllTitles,
    addTitle,
    updateTitle,
    getTitleById,
    checkDuplicateTitle
};
