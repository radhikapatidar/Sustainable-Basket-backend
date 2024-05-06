const Media = require('../model/mediaModel')

const createMedia = async (req, res) => {
    try {
        const { title, images } = req.body;
        const newMedia = new Media({
            title,
            images,
        });
        await newMedia.save();
        res.status(201).json({ message: 'Media data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to handle GET request for fetching all media
const getAllMedia = async (req, res) => {
    try {
        const allMedia = await Media.find();
        res.json(allMedia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = {
createMedia,
getAllMedia
   }