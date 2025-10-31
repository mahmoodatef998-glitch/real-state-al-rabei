const express = require('express');
const Lead = require('../models/Lead');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all leads (admin/agent only)
router.get('/', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      property_id: req.query.property_id,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const leads = await Lead.getAll(filters);
    res.json({ leads });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lead by ID
router.get('/:id', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new lead (public endpoint)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, property_id } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // If property_id provided, validate property exists and get broker info
    let brokerInfo = null;
    if (property_id) {
      const Property = require('../models/Property');
      const property = await Property.findById(property_id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Get broker (owner) info if property has an owner
      if (property.owner && (property.owner.role === 'broker' || property.owner.role === 'admin')) {
        brokerInfo = {
          id: property.owner.id,
          name: property.owner.name,
          phone: property.owner.phone,
          whatsapp: property.owner.whatsapp,
          email: property.owner.email
        };
      }
    }

    const leadData = {
      name,
      email,
      phone,
      message,
      property_id
    };

    const lead = await Lead.create(leadData);
    
    res.status(201).json({
      message: 'Interest expressed successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lead status (admin/agent only)
router.put('/:id', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    await lead.update({ status });

    res.json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete lead (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.delete();

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leads by property
router.get('/property/:propertyId', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const { propertyId } = req.params;
    const leads = await Lead.getByProperty(propertyId);
    
    res.json({ leads });
  } catch (error) {
    console.error('Get property leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lead statistics (admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const allLeads = await Lead.getAll();
    
    const stats = {
      total: allLeads.length,
      new: allLeads.filter(lead => lead.status === 'new').length,
      contacted: allLeads.filter(lead => lead.status === 'contacted').length,
      converted: allLeads.filter(lead => lead.status === 'converted').length,
      closed: allLeads.filter(lead => lead.status === 'closed').length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
