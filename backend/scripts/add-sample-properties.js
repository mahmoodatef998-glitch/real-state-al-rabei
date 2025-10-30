const { db } = require('../database/db');

// Add sample properties with images
const addSampleProperties = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Clear existing properties
      db.run('DELETE FROM properties', (err) => {
        if (err) {
          console.error('Error clearing properties:', err);
          reject(err);
          return;
        }

        // Insert sample properties
        const sampleProperties = [
          {
            title: 'Luxury 3BR Villa in Ajman',
            description: 'Beautiful luxury villa with modern amenities, garden, and parking space. Perfect for families looking for comfort and elegance.',
            type: 'villa',
            purpose: 'sale',
            price: 1250000,
            area_sqft: 3000,
            bedrooms: 3,
            bathrooms: 3,
            emirate: 'ajman',
            location: 'Ajman Marina',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['Garden', 'Parking', 'Modern Kitchen', 'Swimming Pool', 'Security System']),
            owner_id: 1,
            status: 'active'
          },
          {
            title: 'Modern 2BR Apartment in Dubai',
            description: 'Contemporary apartment in the heart of Dubai with stunning city views and premium amenities.',
            type: 'apartment',
            purpose: 'rent',
            price: 15000,
            area_sqft: 1200,
            bedrooms: 2,
            bathrooms: 2,
            emirate: 'dubai',
            location: 'Downtown Dubai',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['City View', 'Gym', 'Pool', 'Concierge', 'Balcony']),
            owner_id: 2,
            status: 'active'
          },
          {
            title: 'Commercial Office Space in Sharjah',
            description: 'Prime commercial office space in Sharjah business district, perfect for corporate offices.',
            type: 'commercial',
            purpose: 'rent',
            price: 25000,
            area_sqft: 2000,
            bedrooms: 0,
            bathrooms: 2,
            emirate: 'sharjah',
            location: 'Sharjah Business District',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['Parking', 'Reception', 'Meeting Rooms', 'Air Conditioning', 'Security']),
            owner_id: 1,
            status: 'active'
          },
          {
            title: 'Spacious 4BR Villa in Abu Dhabi',
            description: 'Large family villa with private garden, perfect for extended families.',
            type: 'villa',
            purpose: 'sale',
            price: 2800000,
            area_sqft: 4500,
            bedrooms: 4,
            bathrooms: 4,
            emirate: 'abu-dhabi',
            location: 'Al Reem Island',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['Private Garden', 'Swimming Pool', 'Garage', 'Maid Room', 'Study Room']),
            owner_id: 2,
            status: 'active'
          },
          {
            title: 'Cozy 1BR Apartment in Ajman',
            description: 'Affordable apartment perfect for young professionals or couples.',
            type: 'apartment',
            purpose: 'rent',
            price: 8000,
            area_sqft: 800,
            bedrooms: 1,
            bathrooms: 1,
            emirate: 'ajman',
            location: 'Ajman Corniche',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['Sea View', 'Balcony', 'Parking', 'Security']),
            owner_id: 1,
            status: 'active'
          },
          {
            title: 'Investment Land in Ras Al Khaimah',
            description: 'Prime land for investment or development projects.',
            type: 'land',
            purpose: 'sale',
            price: 500000,
            area_sqft: 10000,
            bedrooms: 0,
            bathrooms: 0,
            emirate: 'ras-al-khaimah',
            location: 'RAK Investment Zone',
            images: JSON.stringify([
              'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
            ]),
            features: JSON.stringify(['Investment Zone', 'Easy Access', 'Utilities Available', 'Development Ready']),
            owner_id: 2,
            status: 'active'
          }
        ];

        let completed = 0;
        sampleProperties.forEach((property, index) => {
          const query = `
            INSERT INTO properties (
              title, description, type, purpose, price, area_sqft,
              bedrooms, bathrooms, emirate, location, images, features, owner_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.run(query, [
            property.title, property.description, property.type, property.purpose,
            property.price, property.area_sqft, property.bedrooms, property.bathrooms,
            property.emirate, property.location, property.images, property.features,
            property.owner_id, property.status
          ], (err) => {
            if (err) {
              console.error(`Error inserting property ${index + 1}:`, err);
              reject(err);
              return;
            }

            completed++;
            if (completed === sampleProperties.length) {
              console.log('✅ Sample properties added successfully');
              resolve();
            }
          });
        });
      });
    });
  });
};

module.exports = { addSampleProperties };
