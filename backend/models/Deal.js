const { prisma } = require('../database/db');

class Deal {
  constructor(data) {
    this.id = data.id;
    this.property_id = data.property_id || data.propertyId;
    this.broker_id = data.broker_id || data.brokerId;
    this.company_id = data.company_id || data.companyId;
    this.client_name = data.client_name || data.clientName;
    this.sale_price = data.sale_price || data.salePrice;
    this.commission_rate = data.commission_rate || data.commissionRate;
    this.broker_share = data.broker_share || data.brokerShare;
    this.company_share = data.company_share || data.companyShare;
    this.status = data.status || 'completed';
    this.created_at = data.created_at || data.createdAt;
    this.updated_at = data.updated_at || data.updatedAt;
  }

  static async create(dealData) {
    const {
      propertyId,
      brokerId,
      companyId,
      clientName,
      salePrice,
      commissionRate
    } = dealData;

    // Calculate shares based on broker rate (70% broker, 30% company)
    const brokerRate = 0.7; // 70% broker, 30% company
    const brokerShare = salePrice * commissionRate * brokerRate;
    const companyShare = salePrice * commissionRate * (1 - brokerRate);

    const created = await prisma.deal.create({
      data: {
        propertyId,
        brokerId,
        companyId,
        clientName,
        salePrice,
        commissionRate,
        brokerShare,
        companyShare,
        status: 'completed'
      },
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      }
    });

    return new Deal(created);
  }

  static async findById(id) {
    const deal = await prisma.deal.findUnique({
      where: { id: parseInt(id) },
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      }
    });

    return deal ? new Deal(deal) : null;
  }

  static async findByBroker(brokerId, options = {}) {
    const { limit, offset } = options;
    const deals = await prisma.deal.findMany({
      where: { brokerId: parseInt(brokerId) },
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return deals.map(deal => new Deal(deal));
  }

  static async findByCompany(companyId, options = {}) {
    const { limit, offset } = options;
    const deals = await prisma.deal.findMany({
      where: { companyId: parseInt(companyId) },
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return deals.map(deal => new Deal(deal));
  }

  static async getAll(options = {}) {
    const { limit, offset } = options;
    const deals = await prisma.deal.findMany({
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return deals.map(deal => new Deal(deal));
  }

  async update(updateData) {
    const updated = await prisma.deal.update({
      where: { id: this.id },
      data: updateData,
      include: {
        property: true,
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      }
    });

    Object.assign(this, updated);
    return this;
  }

  async delete() {
    await prisma.deal.delete({
      where: { id: this.id }
    });
  }

  // Helper method to calculate totals
  static async getTotals(brokerId = null, companyId = null) {
    const where = {};
    if (brokerId) where.brokerId = parseInt(brokerId);
    if (companyId) where.companyId = parseInt(companyId);

    const deals = await prisma.deal.findMany({ where });

    const totals = {
      totalDeals: deals.length,
      totalSalePrice: 0,
      totalCommission: 0,
      totalBrokerShare: 0,
      totalCompanyShare: 0
    };

    deals.forEach(deal => {
      totals.totalSalePrice += parseFloat(deal.salePrice);
      const commission = parseFloat(deal.salePrice) * parseFloat(deal.commissionRate);
      totals.totalCommission += commission;
      totals.totalBrokerShare += parseFloat(deal.brokerShare);
      totals.totalCompanyShare += parseFloat(deal.companyShare);
    });

    return totals;
  }
}

module.exports = Deal;

