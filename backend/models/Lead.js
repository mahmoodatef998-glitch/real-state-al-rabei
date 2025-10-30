const { prisma } = require('../database/db');

class Lead {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.message = data.message;
    this.property_id = data.property_id || data.propertyId;
    this.status = data.status || 'new';
    this.created_at = data.created_at || data.createdAt;
    this.updated_at = data.updated_at || data.updatedAt;
  }

  static async create(leadData) {
    const created = await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        message: leadData.message || null,
        propertyId: leadData.property_id != null ? Number(leadData.property_id) : null,
        status: 'new',
      },
    });
    return new Lead(created);
  }

  static async findById(id) {
    const row = await prisma.lead.findUnique({ where: { id: Number(id) } });
    return row ? new Lead(row) : null;
  }

  static async getAll(filters = {}) {
    const where = {};
    if (filters.status && filters.status !== 'all') where.status = filters.status;
    if (filters.property_id) where.propertyId = Number(filters.property_id);

    const rows = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, take: filters.limit ? Number(filters.limit) : undefined });
    return rows.map(r => new Lead(r));
  }

  static async getByProperty(propertyId) {
    const rows = await prisma.lead.findMany({ where: { propertyId: Number(propertyId) }, orderBy: { createdAt: 'desc' } });
    return rows.map(r => new Lead(r));
  }

  async update(updateData) {
    const updated = await prisma.lead.update({
      where: { id: Number(this.id) },
      data: {
        name: updateData.name !== undefined ? updateData.name : undefined,
        email: updateData.email !== undefined ? updateData.email : undefined,
        phone: updateData.phone !== undefined ? updateData.phone : undefined,
        message: updateData.message !== undefined ? updateData.message : undefined,
        status: updateData.status !== undefined ? updateData.status : undefined,
        propertyId: updateData.property_id !== undefined ? Number(updateData.property_id) : undefined,
      },
    });
    Object.assign(this, new Lead(updated));
    return this;
  }

  async delete() {
    await prisma.lead.delete({ where: { id: Number(this.id) } });
    return true;
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = Lead;
