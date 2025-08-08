export const SITE_CONFIG = {
    name: 'Global Visa',
    description: 'Professional visa consultancy services',
    url: 'https://globalvisa.com',
    phone: '+902121234567',
    mobile: '+905551234567',
    whatsapp: '905551234567',
    email: 'info@globalvisa.com',
    address: {
      street: 'Levent Business District',
      city: 'Istanbul',
      postalCode: '34330',
      country: 'Turkey'
    },
    social: {
      facebook: 'https://facebook.com/globalvisa',
      instagram: 'https://instagram.com/globalvisa',
      twitter: 'https://twitter.com/globalvisa',
      linkedin: 'https://linkedin.com/company/globalvisa'
    }
  }
  
  export const VISA_TYPES = [
    { id: 'tourist', name: 'Tourist Visa', price: 150 },
    { id: 'business', name: 'Business Visa', price: 250 },
    { id: 'student', name: 'Student Visa', price: 200 },
    { id: 'family', name: 'Family Reunion', price: 300 },
    { id: 'transit', name: 'Transit Visa', price: 100 },
    { id: 'work', name: 'Work Visa', price: 350 }
  ]
  
  export const COUNTRIES = [
    // Schengen
    { code: 'DE', name: 'Germany', region: 'Schengen' },
    { code: 'FR', name: 'France', region: 'Schengen' },
    { code: 'IT', name: 'Italy', region: 'Schengen' },
    { code: 'ES', name: 'Spain', region: 'Schengen' },
    { code: 'NL', name: 'Netherlands', region: 'Schengen' },
    { code: 'BE', name: 'Belgium', region: 'Schengen' },
    // Americas
    { code: 'US', name: 'USA', region: 'Americas' },
    { code: 'CA', name: 'Canada', region: 'Americas' },
    { code: 'BR', name: 'Brazil', region: 'Americas' },
    { code: 'MX', name: 'Mexico', region: 'Americas' },
    // UK & Ireland
    { code: 'GB', name: 'UK', region: 'UK & Ireland' },
    { code: 'IE', name: 'Ireland', region: 'UK & Ireland' },
    // Asia Pacific
    { code: 'AU', name: 'Australia', region: 'Asia Pacific' },
    { code: 'JP', name: 'Japan', region: 'Asia Pacific' },
    { code: 'KR', name: 'South Korea', region: 'Asia Pacific' },
    { code: 'SG', name: 'Singapore', region: 'Asia Pacific' }
  ]