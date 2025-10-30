const express = require('express');
const Property = require('../models/Property');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  validateProperty, 
  handleValidationErrors 
} = require('../validators/propertyValidator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

const router = express.Router();

// Get new arrivals (latest properties) - must be before /:id route
router.get('/new-arrivals/:limit?', async (req, res) => {
  try {
    const limit = req.params.limit ? parseInt(req.params.limit) : 6;
    const properties = await Property.getAll({ limit, sort: 'newest' });
    res.json({ properties });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      purpose: req.query.purpose,
      emirate: req.query.emirate,
      price_min: req.query.price_min ? parseInt(req.query.price_min) : undefined,
      price_max: req.query.price_max ? parseInt(req.query.price_max) : undefined,
      search: req.query.search,
      sort: req.query.sort,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const properties = await Property.getAll(filters);
    res.json({ properties });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new property (with image upload)
router.post('/', authenticateToken, requireRole(['admin', 'broker']), upload.array('images', 100), async (req, res, next) => {
  try {
    const files = req.files || [];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const images = files.map(file => `${baseUrl}/uploads/${file.filename}`);
    const {
      title, description, type, purpose, price, area_sqft,
      bedrooms, bathrooms, emirate, location, features
    } = req.body;

    // If JSON string, parse features
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try { parsedFeatures = JSON.parse(features); } catch { parsedFeatures = features.split(',').map(f => f.trim()).filter(Boolean); }
    }
    const propertyData = {
      title: title,
      description: description,
      type: type,
      purpose: purpose,
      price: parseInt(price),
      area_sqft: area_sqft ? parseInt(area_sqft) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      emirate: emirate,
      location: location,
      images: images,
      features: parsedFeatures,
      owner_id: req.user.id
    };
    const property = await Property.create(propertyData);
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    next(error);
  }
});

// Update property
router.put('/:id', authenticateToken, validateProperty, handleValidationErrors, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        error: 'Property not found' 
      });
    }

    // Check if user is owner or admin
    if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }

    const {
      title, description, type, purpose, price, area_sqft,
      bedrooms, bathrooms, emirate, location, images, features, status
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (purpose) updateData.purpose = purpose;
    if (price) updateData.price = parseInt(price);
    if (area_sqft) updateData.area_sqft = parseInt(area_sqft);
    if (bedrooms) updateData.bedrooms = parseInt(bedrooms);
    if (bathrooms) updateData.bathrooms = parseInt(bathrooms);
    if (emirate) updateData.emirate = emirate;
    if (location) updateData.location = location;
    if (images) updateData.images = images;
    if (features) updateData.features = features;
    if (status && req.user.role === 'admin') updateData.status = status;

    await property.update(updateData);

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    next(error);
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is owner or admin
    if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await property.delete();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get properties by owner
router.get('/owner/:ownerId', authenticateToken, async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Check if user is viewing their own properties or is admin
    if (ownerId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const properties = await Property.getByOwner(ownerId);
    res.json({ properties });
  } catch (error) {
    console.error('Get owner properties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
