// Lead service using localStorage

// Get all leads
export const getAllLeads = () => {
  try {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    return {
      success: true,
      leads
    };
  } catch (error) {
    console.error('Error getting leads:', error);
    return {
      success: false,
      error: 'Failed to get leads'
    };
  }
};

// Create new lead
export const createLead = (leadData) => {
  try {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const newLead = {
      id: Date.now(),
      ...leadData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    leads.push(newLead);
    localStorage.setItem('leads', JSON.stringify(leads));
    
    return {
      success: true,
      lead: newLead
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      error: 'Failed to create lead'
    };
  }
};

// Update lead status
export const updateLeadStatus = (leadId, status) => {
  try {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const leadIndex = leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex !== -1) {
      leads[leadIndex].status = status;
      leads[leadIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('leads', JSON.stringify(leads));
      
      return {
        success: true,
        lead: leads[leadIndex]
      };
    } else {
      return {
        success: false,
        error: 'Lead not found'
      };
    }
  } catch (error) {
    console.error('Error updating lead:', error);
    return {
      success: false,
      error: 'Failed to update lead'
    };
  }
};

// Delete lead
export const deleteLead = (leadId) => {
  try {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const filteredLeads = leads.filter(lead => lead.id !== leadId);
    
    if (filteredLeads.length < leads.length) {
      localStorage.setItem('leads', JSON.stringify(filteredLeads));
      return {
        success: true,
        message: 'Lead deleted successfully'
      };
    } else {
      return {
        success: false,
        error: 'Lead not found'
      };
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    return {
      success: false,
      error: 'Failed to delete lead'
    };
  }
};
