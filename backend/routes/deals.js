const express = require('express');
const Deal = require('../models/Deal');
const Property = require('../models/Property');
const Company = require('../models/Company');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all deals (admin only) or filtered by brokerId/companyId
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { brokerId, companyId } = req.query;
    
    // If user is not admin, they can only see their own deals (if broker)
    if (req.user.role !== 'admin' && req.user.role !== 'broker') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Only admins and brokers can view deals.' 
      });
    }

    let deals = [];
    let totals = null;

    if (brokerId) {
      // Validate: brokers can only see their own deals unless admin
      if (req.user.role === 'broker' && parseInt(brokerId) !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied. You can only view your own deals.' 
        });
      }

      deals = await Deal.findByBroker(brokerId);
      totals = await Deal.getTotals(parseInt(brokerId), null);
    } else if (companyId) {
      // Only admins can filter by company
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied. Only admins can filter by company.' 
        });
      }

      deals = await Deal.findByCompany(companyId);
      totals = await Deal.getTotals(null, parseInt(companyId));
    } else {
      // Get all deals (admin only)
      if (req.user.role !== 'admin') {
        // For brokers, return only their deals
        deals = await Deal.findByBroker(req.user.id);
        totals = await Deal.getTotals(req.user.id, null);
      } else {
        deals = await Deal.getAll();
        totals = await Deal.getTotals();
      }
    }

    res.json({
      success: true,
      deals,
      totals
    });
  } catch (error) {
    console.error('Get deals error:', error);
    next(error);
  }
});

// Get deal by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ 
        success: false,
        error: 'Deal not found' 
      });
    }

    // Check permissions: brokers can only see their own deals
    if (req.user.role === 'broker' && deal.broker_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. You can only view your own deals.' 
      });
    }

    res.json({
      success: true,
      deal
    });
  } catch (error) {
    console.error('Get deal by ID error:', error);
    next(error);
  }
});

// Create new deal
router.post('/', authenticateToken, requireRole(['admin', 'broker']), async (req, res, next) => {
  try {
    const {
      propertyId,
      brokerId,
      companyId,
      clientName,
      salePrice,
      commissionRate
    } = req.body;

    // Validation
    if (!propertyId || !brokerId || !companyId || !clientName || !salePrice || !commissionRate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: propertyId, brokerId, companyId, clientName, salePrice, commissionRate'
      });
    }

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Validate broker exists and has correct role
    const { prisma } = require('../database/db');
    const broker = await prisma.user.findUnique({
      where: { id: parseInt(brokerId) }
    });

    if (!broker) {
      return res.status(404).json({
        success: false,
        error: 'Broker not found'
      });
    }

    if (broker.role !== 'broker' && broker.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Selected user is not a broker'
      });
    }

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Validate commission rate (should be between 0 and 1, e.g., 0.05 for 5%)
    if (commissionRate < 0 || commissionRate > 1) {
      return res.status(400).json({
        success: false,
        error: 'Commission rate must be between 0 and 1 (e.g., 0.05 for 5%)'
      });
    }

    // Validate sale price
    if (salePrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Sale price must be greater than 0'
      });
    }

    // If broker is creating deal, ensure they're creating it for themselves
    if (req.user.role === 'broker' && parseInt(brokerId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Brokers can only create deals for themselves'
      });
    }

    // Create deal (shares are calculated automatically in Deal.create)
    const deal = await Deal.create({
      propertyId: parseInt(propertyId),
      brokerId: parseInt(brokerId),
      companyId: parseInt(companyId),
      clientName,
      salePrice: parseFloat(salePrice),
      commissionRate: parseFloat(commissionRate)
    });

    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      deal
    });
  } catch (error) {
    console.error('Create deal error:', error);
    next(error);
  }
});

// Update deal (admin only, or broker for their own deals)
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && deal.broker_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const {
      clientName,
      salePrice,
      commissionRate,
      status
    } = req.body;

    const updateData = {};

    if (clientName !== undefined) updateData.clientName = clientName;
    if (status !== undefined && req.user.role === 'admin') updateData.status = status;

    // If salePrice or commissionRate changed, recalculate shares
    if (salePrice !== undefined || commissionRate !== undefined) {
      const finalSalePrice = salePrice !== undefined ? parseFloat(salePrice) : deal.sale_price;
      const finalCommissionRate = commissionRate !== undefined ? parseFloat(commissionRate) : deal.commission_rate;

      const brokerRate = 0.7; // 70% broker, 30% company
      updateData.salePrice = finalSalePrice;
      updateData.commissionRate = finalCommissionRate;
      updateData.brokerShare = finalSalePrice * finalCommissionRate * brokerRate;
      updateData.companyShare = finalSalePrice * finalCommissionRate * (1 - brokerRate);
    }

    await deal.update(updateData);

    const updatedDeal = await Deal.findById(req.params.id);

    res.json({
      success: true,
      message: 'Deal updated successfully',
      deal: updatedDeal
    });
  } catch (error) {
    console.error('Update deal error:', error);
    next(error);
  }
});

// Delete deal (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    await deal.delete();

    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error('Delete deal error:', error);
    next(error);
  }
});

module.exports = router;

