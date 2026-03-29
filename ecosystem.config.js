// Hermes Ecosystem Configuration
export const ecosystemConfig = {
  name: 'Hermes Ecosystem',
  version: '1.0.0',
  domain: 'exponify.ph',
  
  // Core Platform
  platform: {
    name: 'Hermes Business Intelligence',
    type: 'multi-tenant-saas',
    features: [
      'real-time-analytics',
      'enterprise-security',
      'multi-tenant',
      'api-first',
      'scalable'
    ]
  },

  // Partner Programs
  partners: {
    technology: {
      name: 'Technology Partners',
      commission: '20%',
      benefits: ['api-access', 'co-marketing', 'technical-support']
    },
    implementation: {
      name: 'Implementation Partners', 
      commission: '30%',
      benefits: ['training', 'certification', 'lead-generation']
    },
    channel: {
      name: 'Channel Partners',
      commission: '40%', 
      benefits: ['reseller-rights', 'branding', 'support']
    }
  },

  // Marketplace
  marketplace: {
    apps: {
      enabled: true,
      commission: '15%',
      categories: ['analytics', 'integrations', 'templates', 'components']
    }
  },

  // API Configuration
  api: {
    version: 'v1',
    base_url: 'https://api.hermes.exponify.ph',
    endpoints: {
      analytics: '/analytics',
      users: '/users',
      reports: '/reports',
      integrations: '/integrations'
    }
  },

  // Security
  security: {
    oauth: true,
    sso: true,
    audit_logging: true,
    data_encryption: true
  },

  // Support
  support: {
    email: 'ecosystem@exponify.ph',
    documentation: 'https://docs.hermes.exponify.ph',
    community: 'https://community.hermes.exponify.ph'
  }
};

export default ecosystemConfig;
