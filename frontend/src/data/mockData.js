// Mock data for properties
export const mockProperties = [
  {
    id: 1,
    title: "فيلا فاخرة في الرياض",
    description: "فيلا حديثة مع حديقة واسعة وبركة سباحة",
    price: 2500000,
    location: "الرياض، حي النرجس",
    type: "فيلا",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"
    ],
    features: ["حديقة", "بركة سباحة", "جراج", "أمن 24/7"],
    isNew: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "شقة عصرية في جدة",
    description: "شقة حديثة مع إطلالة على البحر",
    price: 1200000,
    location: "جدة، حي الزهراء",
    type: "شقة",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    features: ["إطلالة بحرية", "مصعد", "أمن", "موقف سيارات"],
    isNew: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: "منزل عائلي في الدمام",
    description: "منزل واسع مناسب للعائلات الكبيرة",
    price: 1800000,
    location: "الدمام، حي الفيصلية",
    type: "منزل",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    features: ["حديقة", "جراج", "أمن", "قريب من المدارس"],
    isNew: false,
    isFeatured: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    title: "شقة راقية في الخبر",
    description: "شقة فاخرة مع إطلالة خلابة",
    price: 950000,
    location: "الخبر، حي الراكة",
    type: "شقة",
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"
    ],
    features: ["إطلالة خلابة", "مصعد", "أمن", "موقف سيارات"],
    isNew: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    title: "فيلا شاطئية في ينبع",
    description: "فيلا على الشاطئ مع إطلالة مباشرة على البحر",
    price: 3200000,
    location: "ينبع، حي الشاطئ",
    type: "فيلا",
    bedrooms: 6,
    bathrooms: 5,
    area: 600,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    features: ["إطلالة بحرية", "بركة سباحة", "حديقة", "شاطئ خاص"],
    isNew: false,
    isFeatured: true,
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 6,
    title: "شقة حديثة في المدينة",
    description: "شقة جديدة مع جميع الخدمات",
    price: 750000,
    location: "المدينة المنورة، حي العقيق",
    type: "شقة",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    features: ["جديد", "مصعد", "أمن", "قريب من المسجد النبوي"],
    isNew: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

// Mock data for leads
export const mockLeads = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    propertyId: 1,
    message: "أريد معرفة المزيد عن هذه الفيلا",
    status: "new",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966507654321",
    propertyId: 2,
    message: "هل يمكن ترتيب زيارة للمعاينة؟",
    status: "contacted",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Initialize localStorage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem('properties')) {
    localStorage.setItem('properties', JSON.stringify(mockProperties));
  }
  if (!localStorage.getItem('leads')) {
    localStorage.setItem('leads', JSON.stringify(mockLeads));
  }
};
