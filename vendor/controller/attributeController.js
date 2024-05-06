const VendorAttribute = require('../model/attributeModel')


// POST method to create a new vendor attribute
const createVendorAttribute = async (req, res) => {
    try {
      const { vendor, attributeName, attributeOptions } = req.body;
    //   if (!vendor || !attributeName || !attributeOptions) {
    //     return res.status(400).json({ message: "Vendor, AttributeName, and AttributeOptions are required" });
    //   }
      const newVendorAttribute = new VendorAttribute({
        vendor,
        attributeName,
        attributeOptions,
      });
      await newVendorAttribute.save();
  
      res.status(201).json({ message: "Vendor attribute created successfully", vendorAttribute: newVendorAttribute });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // GET method to fetch all vendor attributes
    const getAllVendorAttributes = async (req, res) => {
        try {
        const vendorAttributes = await VendorAttribute.find();
        res.json(vendorAttributes);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        }
    };

    // GET method to fetch a vendor attribute by ID
const getVendorAttributeById = async (req, res) => {
  const attributeId = req.params.id; // Assuming the ID is passed as a parameter in the URL

  try {
      const vendorAttribute = await VendorAttribute.findById(attributeId);
      res.json(vendorAttribute);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateVendorAttributeById = async (req, res) => {
  const attributeId = req.params.id; // Assuming the ID is passed as a parameter in the URL
  const { attributeName, attributeOptions } = req.body;

  try {
    // Find the vendor attribute by ID and update its fields
    const updatedAttribute = await VendorAttribute.findByIdAndUpdate(
      attributeId,
      { attributeName, attributeOptions },
      { new: true } // Return the updated document
    );

    if (!updatedAttribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    res.json(updatedAttribute);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  
  // DELETE method 
  const deleteVendorAttribute = async (req, res) => {
    const attributeId = req.params.id;

    try {
        const deletedAttribute = await VendorAttribute.findByIdAndDelete(attributeId);

        if (!deletedAttribute) {
            return res.status(404).json({ message: 'Vendor Attribute not found' });
        }

        res.json({ message: 'Vendor Attribute deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

  module.exports = {
    createVendorAttribute,
    getAllVendorAttributes,
    getVendorAttributeById,
    deleteVendorAttribute,
    updateVendorAttributeById
  }