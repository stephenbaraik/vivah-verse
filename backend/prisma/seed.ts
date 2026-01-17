import { PrismaClient, UserRole, VendorStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Demo venue data for Vivah Verse
const DEMO_VENUES = [
  {
    name: 'The Grand Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: '123 Palace Road, City Palace Area',
    capacity: 1000,
    basePrice: 250000,
    pricePerPlate: 2500,
    description: 'A majestic heritage palace venue with stunning Rajasthani architecture, offering breathtaking views of the Aravalli hills. Perfect for grand Indian weddings with royal ambiance.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Valet', 'Bridal Suite', 'Heritage Rooms'],
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    ],
  },
  {
    name: 'Lakeside Retreat',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Lake Pichola, Old City',
    capacity: 500,
    basePrice: 350000,
    pricePerPlate: 3500,
    description: 'An enchanting lakeside venue with panoramic views of Lake Pichola. The perfect romantic setting for intimate destination weddings.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Boat Arrival', 'Sunset View', 'Luxury Suites'],
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
  },
  {
    name: 'The Orchid Banquets',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '45 Juhu Beach Road, Juhu',
    capacity: 800,
    basePrice: 180000,
    pricePerPlate: 2000,
    description: 'A modern banquet hall with elegant interiors and state-of-the-art facilities. Located near Juhu Beach for stunning sunset photo opportunities.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Valet', 'Stage', 'LED Wall'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
  },
  {
    name: 'Royal Gardens',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Mehrauli, Near Qutub Minar',
    capacity: 1500,
    basePrice: 200000,
    pricePerPlate: 1800,
    description: 'Sprawling garden venue with Mughal-inspired architecture. Multiple lawns and banquet halls for ceremonies of any size.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Multiple Lawns', 'Fountain', 'Helipad'],
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
    ],
  },
  {
    name: 'Beachside Bliss',
    city: 'Goa',
    state: 'Goa',
    address: 'Candolim Beach Road',
    capacity: 300,
    basePrice: 150000,
    pricePerPlate: 2800,
    description: 'A stunning beachfront venue for dreamy beach weddings. Listen to the waves as you exchange vows at sunset.',
    amenities: ['Parking', 'Outdoor', 'Catering', 'Decor', 'DJ', 'Beach Access', 'Bonfire', 'Pool'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800',
    ],
  },
  {
    name: 'The Heritage Haveli',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'MI Road, Pink City',
    capacity: 400,
    basePrice: 280000,
    pricePerPlate: 3000,
    description: 'A beautifully restored 200-year-old haveli featuring traditional Rajasthani craftsmanship. Each corner tells a story of royal heritage.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'Heritage Walk', 'Courtyard', 'Terrace', 'Folk Music'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    ],
  },
  {
    name: 'Silicon Valley Club',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Whitefield, IT Corridor',
    capacity: 600,
    basePrice: 160000,
    pricePerPlate: 1600,
    description: 'A contemporary venue with a blend of modern elegance and traditional charm. Perfect for tech-savvy couples who want style.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Smart Lighting', 'Projector', 'Wifi'],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1587271339700-f0a5c954e08b?w=800',
    ],
  },
  {
    name: 'Nizam Gardens',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Banjara Hills, Road No. 12',
    capacity: 700,
    basePrice: 140000,
    pricePerPlate: 1400,
    description: 'Experience the grandeur of Nizami culture in this opulent venue featuring Persian gardens and regal interiors.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Qawwali Stage', 'Fountain', 'Valet'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1471967183320-ee018f6e114a?w=800',
    ],
  },
  {
    name: 'Marina Bay Resort',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'ECR, Mahabalipuram Road',
    capacity: 450,
    basePrice: 170000,
    pricePerPlate: 1900,
    description: 'A beachfront resort venue offering the best of South Indian hospitality. Perfect for traditional Tamil and multi-cultural weddings.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Beach View', 'Temple', 'Pool'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    ],
  },
  {
    name: 'Backwater Bliss',
    city: 'Kerala',
    state: 'Kerala',
    address: 'Alleppey Backwaters',
    capacity: 200,
    basePrice: 220000,
    pricePerPlate: 3200,
    description: 'An exclusive waterfront venue surrounded by serene backwaters. Arrive by houseboat for a truly magical wedding experience.',
    amenities: ['Parking', 'Outdoor', 'Catering', 'Decor', 'Houseboat', 'Ayurveda Spa', 'Kayaking', 'Cultural Shows'],
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
  },
  {
    name: 'The Fort Palace',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Sajjangarh Road, Udaipur',
    capacity: 350,
    basePrice: 400000,
    pricePerPlate: 4000,
    description: 'A historic fort converted into a luxury wedding venue. Overlooking the city of lakes, it offers unmatched royal grandeur.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Elephant Entry', 'Fireworks', 'Rooftop'],
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
    ],
  },
  {
    name: 'Park View Lawns',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Chanakyapuri, Diplomatic Enclave',
    capacity: 2000,
    basePrice: 300000,
    pricePerPlate: 2200,
    description: 'One of Delhi\'s most prestigious wedding venues with expansive lawns and world-class amenities for mega celebrations.',
    amenities: ['Parking', 'AC', 'Catering', 'Decor', 'DJ', 'Valet', 'Green Rooms', 'Helicopter Landing'],
    images: [
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Vivah Verse database...\n');

  // Create demo vendor user
  const hashedPassword = await bcrypt.hash('VendorDemo123!', 10);
  
  const vendorUser = await prisma.user.upsert({
    where: { email: 'demo-vendor@vivahverse.com' },
    update: {},
    create: {
      email: 'demo-vendor@vivahverse.com',
      password: hashedPassword,
      role: UserRole.VENDOR,
    },
  });

  console.log('✅ Created demo vendor user:', vendorUser.email);

  // Create vendor profile
  const vendor = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {
      businessName: 'Vivah Verse Demo Venues',
      status: VendorStatus.APPROVED,
    },
    create: {
      userId: vendorUser.id,
      businessName: 'Vivah Verse Demo Venues',
      status: VendorStatus.APPROVED,
    },
  });

  console.log('✅ Created vendor profile:', vendor.businessName);

  // Create venues
  console.log('\n📍 Creating demo venues...\n');

  for (const venueData of DEMO_VENUES) {
    // Upsert venue with all fields
    const venue = await prisma.venue.upsert({
      where: {
        id: `venue-${venueData.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
      update: {
        name: venueData.name,
        city: venueData.city,
        state: venueData.state,
        address: venueData.address,
        capacity: venueData.capacity,
        basePrice: venueData.basePrice,
        pricePerPlate: venueData.pricePerPlate,
        description: venueData.description,
        amenities: venueData.amenities,
        images: venueData.images,
      },
      create: {
        id: `venue-${venueData.name.toLowerCase().replace(/\s+/g, '-')}`,
        vendorId: vendor.id,
        name: venueData.name,
        city: venueData.city,
        state: venueData.state,
        address: venueData.address,
        capacity: venueData.capacity,
        basePrice: venueData.basePrice,
        pricePerPlate: venueData.pricePerPlate,
        description: venueData.description,
        amenities: venueData.amenities,
        images: venueData.images,
      },
    });

    console.log(`  ✅ ${venue.name} (${venue.city})`);
  }

  // Create demo client user
  const clientPassword = await bcrypt.hash('ClientDemo123!', 10);
  
  const clientUser = await prisma.user.upsert({
    where: { email: 'demo-client@vivahverse.com' },
    update: {},
    create: {
      email: 'demo-client@vivahverse.com',
      password: clientPassword,
      role: UserRole.CLIENT,
    },
  });

  console.log('\n✅ Created demo client user:', clientUser.email);

  // Create demo admin user
  const adminPassword = await bcrypt.hash('AdminDemo123!', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vivahverse.com' },
    update: {},
    create: {
      email: 'admin@vivahverse.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Created demo admin user:', adminUser.email);

  console.log('\n🎉 Seeding complete!\n');
  console.log('Demo Credentials:');
  console.log('─────────────────────────────────────');
  console.log('Client:  demo-client@vivahverse.com / ClientDemo123!');
  console.log('Vendor:  demo-vendor@vivahverse.com / VendorDemo123!');
  console.log('Admin:   admin@vivahverse.com / AdminDemo123!');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
